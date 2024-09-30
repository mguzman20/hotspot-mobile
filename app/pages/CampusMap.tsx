import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { Stack } from 'expo-router';

export default function CampusMap() {
  const mapRef = useRef<MapView>(null)

  const boundaries = {
    northEast: { latitude: -33.495314, longitude: -70.604986 },
    southWest: { latitude: -33.501466, longitude: -70.616074 },
  }

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setMapBoundaries(boundaries.northEast, boundaries.southWest)
    }
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
      />
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