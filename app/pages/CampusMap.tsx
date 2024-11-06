import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { CampusEvent, CampusSpot } from '../helpers/event';


export default function CampusMap() {
  const mapRef = useRef<MapView>(null);
  const [filterText, setFilterText] = useState<string>('');
  const [category, setCategory] = useState<string>('all');
  const [filteredEvents, setFilteredEvents] = useState<CampusSpot[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { authState } = useAuth()

  const spots: CampusSpot[] = [
    { coordinates: { latitude: -33.495314, longitude: -70.604986 }, title: "Helao", tags: ['Comida'], description: 'lorem ipsum dolor ett' },
    { coordinates: { latitude: -33.495714, longitude: -70.605286 }, title: "Pizza", tags: ['Comida'], description: 'lorem ipsum dolor ett' },
    { coordinates: { latitude: -33.496714, longitude: -70.605286 }, title: 'Pizzas', tags: ['Comida'], description: 'lorem ipsum dolor ett' },
    { coordinates: { latitude: -33.495714, longitude: -70.604286 }, title: 'Evento B', tags: ['Charla'], description: 'lorem ipsum dolor ett' },
    { coordinates: { latitude: -33.496714, longitude: -70.604286 }, title: 'Evento C', tags: ['Concierto'], description: 'lorem ipsum dolor ett' },
  ];

  const fetchEvents = async () => {
    const events = await fetch(process.env.EXPO_PUBLIC_API_URL + '/events', {
      headers: {
        'Auth-Token': authState.token ?? '',
      }
    })
    const data = await events.json()
    // console.log(data)
  }

  useEffect(() => {
    fetchEvents()
  }, [authState.token])

  useEffect(() => {
    let filtered = spots;
    if (filterText.trim() !== '') {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    if (category !== 'all') {
      filtered = filtered.filter(event => event.tags.some(tag => tag === category));
    }
    setFilteredEvents(filtered);
  }, [filterText, category]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const selectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setIsModalVisible(false);
  };

  const [locationStatus, requestLocationPermission] = Location.useForegroundPermissions()
  const [userLocation, setUserLocation] = useState<Region | null>(null);

  const boundaries = {
    northEast: { latitude: -33.495314, longitude: -70.604986 },
    southWest: { latitude: -33.501466, longitude: -70.616074 },
  }

  useEffect(() => {
    requestLocation();
  }, [])


  const requestLocation = async () => {
    requestLocationPermission()
    if (mapRef.current) {
      mapRef.current.setMapBoundaries(boundaries.northEast, boundaries.southWest)
    }
    requestLocation()
    if (locationStatus?.status !== 'granted') {
      console.log('Permission to access location was denied');
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

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleModal}>
          <Text style={styles.buttonText}>Categorías</Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Filtrar eventos por nombre"
          value={filterText}
          onChangeText={setFilterText}
        />
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
          <TouchableOpacity style={styles.modalOption} onPress={() => selectCategory('Comida')}>
            <Text>Comida</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={() => selectCategory('Charla')}>
            <Text>Charla</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={() => selectCategory('Concierto')}>
            <Text>Concierto</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: (boundaries.southWest.latitude + boundaries.northEast.latitude) / 2,
          longitude: (boundaries.southWest.longitude + boundaries.northEast.longitude) / 2,
          latitudeDelta: boundaries.northEast.latitude - boundaries.southWest.latitude,
          longitudeDelta: boundaries.northEast.longitude - boundaries.southWest.longitude,
        }}
        style={styles.map}
        provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
        showsUserLocation={true}
      >
        {filteredEvents.map((event, index) => (
          <Marker
            key={index}
            coordinate={event.coordinates}
            title={event.title}
            description={'Categoria: ' + event.tags.join(' ')}
          />
        ))}
      </MapView>
      <View style={styles.posIcon}>
        <FontAwesome name="map-marker" size={40} color="red" />
      </View>
      {/* Show only if location was granted */}
      {userLocation && (
              <TouchableOpacity style={styles.centerIcon} onPress={centerMapOnUserLocation}>
              <FontAwesome name="crosshairs" size={24} color="white" />
            </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.plusButton} onPress={() => console.log('Agregar una location nuevo')}>
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
    marginLeft: -20, // Ajusta la posición horizontal del icono
    marginTop: -40,  // Ajusta la posición vertical del icono
    zIndex: 3,
  },
});
