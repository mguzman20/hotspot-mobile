import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, Modal } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';

interface CampusEvent {
  coordinate: { latitude: number, longitude: number };
  name: string;
  category: string;
}

export default function CampusMap() {
  const mapRef = useRef<MapView>(null);
  const [filterText, setFilterText] = useState<string>('');
  const [category, setCategory] = useState<string>('all');
  const [filteredEvents, setFilteredEvents] = useState<CampusEvent[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const events: CampusEvent[] = [
    {coordinate: { latitude: -33.495314, longitude: -70.604986 }, name: "Helao", category: 'Comida'},
    {coordinate: { latitude: -33.495714, longitude: -70.605286 }, name: "Pizza", category: 'Comida'},
    { coordinate: { latitude: -33.496714, longitude: -70.605286 }, name: 'Pizzas', category: 'Comida' },
    { coordinate: { latitude: -33.495714, longitude: -70.604286 }, name: 'Evento B', category: 'Charla' },
    { coordinate: { latitude: -33.496714, longitude: -70.604286 }, name: 'Evento C', category: 'Concierto' },
  ];

  useEffect(() => {
    let filtered = events;
    if (filterText.trim() !== '') {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    if (category !== 'all') {
      filtered = filtered.filter(event => event.category === category);
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

  const [locationStatus, requestLocation] = Location.useForegroundPermissions()

  const boundaries = {
    northEast: { latitude: -33.495314, longitude: -70.604986 },
    southWest: { latitude: -33.501466, longitude: -70.616074 },
  }

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setMapBoundaries(boundaries.northEast, boundaries.southWest)
    }
    requestLocation()
  }, [])

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
            coordinate={event.coordinate}
            title={event.name}
            description={'Categoria: '+ event.category}
          />
        ))}
      </MapView>
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
});
