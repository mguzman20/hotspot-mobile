import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT, Region, Details, Camera } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { CampusEvent, CampusLocation, CampusSpot, CATEGORIES } from '../helpers/backend';
import { capitalize } from '../helpers/util';

type RootStackParamList = {
  CreationMenu: { initialRegion: Camera };
  Map: undefined;
  EventDetail: { eventId: string }
  LocationDetail: { locationId: string }
};

type EventsNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

export default function CampusMap() {
  const boundaries = {
    northEast: { latitude: -33.495314, longitude: -70.604986 },
    southWest: { latitude: -33.501466, longitude: -70.616074 },
  }

  const defaultRegion: Region = {
    latitude: (boundaries.southWest.latitude + boundaries.northEast.latitude) / 2,
    longitude: (boundaries.southWest.longitude + boundaries.northEast.longitude) / 2,
    latitudeDelta: boundaries.northEast.latitude - boundaries.southWest.latitude,
    longitudeDelta: boundaries.northEast.longitude - boundaries.southWest.longitude,
  }

  const mapRef = useRef<MapView>(null);
  const [filterText, setFilterText] = useState<string>('');
  const [filterCategory, setCategory] = useState<string>('all');
  const [filteredSpots, setFilteredEvents] = useState<CampusSpot[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false);
  const { authState, reloadSpots: reloadEvents } = useAuth()
  const navigation = useNavigation<EventsNavigationProp>();
  const showCenterMarker = false;
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowMap(true), 1000)
  }, [])

  useEffect(() => {
    reloadEvents()
  }, [authState.token])

  useEffect(() => {
    let filtered: CampusSpot[] = [...authState.eventList, ...authState.locationList];
    if (filterText.trim() !== '') {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(event => event.category === filterCategory);
    }
    setFilteredEvents(filtered);
  }, [filterText, filterCategory, authState.eventList, authState.locationList]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const selectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setIsModalVisible(false);
  };

  const [locationStatus, requestLocationPermission] = Location.useForegroundPermissions()
  const [userLocation, setUserLocation] = useState<Region | null>(null);

  useEffect(() => {
    requestLocation();
  }, [])


  const requestLocation = async () => {
    requestLocationPermission()
    if (mapRef.current) {
      mapRef.current.setMapBoundaries(boundaries.northEast, boundaries.southWest)
    }
    if (locationStatus?.status !== 'granted') {
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setUserLocation(region)
  }
  const centerMapOnUserLocation = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion(userLocation, 1000); // 1000 ms para una transición suave
    }
  };

  const toggleSearchBar = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const toggleEvents = () => {
  }

  const toggleLocations = () => {
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleModal}>
          {/* Category Icon */}
          <FontAwesome name="filter" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleSearchBar}>
          <FontAwesome name="search" size={24} color="white" />
        </TouchableOpacity>
        {isSearchExpanded && (
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Filtrar eventos por nombre"
            value={filterText}
            onChangeText={setFilterText}
          />
        )}
        {/* Button that says Events */}
        <TouchableOpacity style={styles.button} onPress={toggleEvents}>
          <Text style={styles.buttonText}>Eventos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleLocations}>
          <Text style={styles.buttonText}>Locations</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOption} onPress={() => selectCategory('all')}>
            <Text>Todos</Text>
          </TouchableOpacity>
          {
            CATEGORIES.map(id => (
              <TouchableOpacity key={id} style={styles.modalOption} onPress={() => selectCategory(id)}>
                <Text>{capitalize(id)}</Text>
              </TouchableOpacity>
            ))
          }

        </View>
      </Modal>
      {showMap && <MapView
        ref={mapRef}
        initialRegion={defaultRegion}
        style={styles.map}
        provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
        showsUserLocation={true}
      >
        {filteredSpots.map((spot, index) => (
          <Marker
            key={index}
            coordinate={spot.coordinates}
            title={
              "date" in spot ? `Evento: ${spot.title}` : spot.title}
            description={'Categoria: ' + capitalize(spot.category)}
            onCalloutPress={() => {
              console.log("callout press")
              if ("date" in spot) {
                navigation.navigate("EventDetail", { eventId: spot._id })
              } else {
                navigation.navigate("LocationDetail", { locationId: spot._id })
              }
            }}
            onSelect={() => {
              console.log("select")
            }}
            style={{
              zIndex: 2,
            }}
          >
            <FontAwesome name="map-marker" size={40} color={'date' in spot ? "green" : "blue"} style={{
              marginTop: -3
            }} />
          </Marker>
        ))}
      </MapView>}
      {showCenterMarker && <View style={styles.posIcon}>
        <FontAwesome name="map-marker" size={40} color="red" />
      </View>}
      {/* Show only if location was granted */}
      {userLocation && (
        <TouchableOpacity style={styles.centerIcon} onPress={centerMapOnUserLocation}>
          <FontAwesome name="crosshairs" size={24} color="white" />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.plusButton} onPress={async () => {
        if (authState.authenticated) {
          const camera = await mapRef.current?.getCamera()
          if (camera != null) {
            navigation.navigate("CreationMenu", { initialRegion: camera })
          }
        } else {
          Alert.alert('Inicia sesión para crear ubicaciones!')
        }
      }}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  filterContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: 10,
    height: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    height: '100%',
  },
  buttonText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalOption: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  plusButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007bff',
    borderRadius: 25,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIcon: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: 'black',
    borderRadius: 25,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10, // Ajusta la posición horizontal del icono
    marginTop: -40,  // Ajusta la posición vertical del icono
    zIndex: 3,
  },
});
