import { View, Text, StyleSheet, Platform } from 'react-native';
import React, { useEffect, useRef } from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';

interface CampusEvent {
  coordinate: {latitude: number, longitude: number}
  name: string
}

export default function CampusMap() {
  const mapRef = useRef<MapView>(null)
  const events: CampusEvent[] = [
    {coordinate: { latitude: -33.495314, longitude: -70.604986 }, name: "Helao"},
    {coordinate: { latitude: -33.495714, longitude: -70.605286 }, name: "Pizza"},
  ]
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
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: (boundaries.southWest.latitude + boundaries.northEast.latitude) / 2,
          longitude: (boundaries.southWest.longitude + boundaries.northEast.longitude) / 2,
          latitudeDelta: boundaries.northEast.latitude - boundaries.southWest.latitude,
          longitudeDelta: boundaries.northEast.longitude - boundaries.southWest.longitude,
        }}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
      >
        {events.map((ev, idx) => (
          <Marker key={idx} coordinate={ev.coordinate} title={ev.name}/>
        ))}
      </MapView>
  	</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});