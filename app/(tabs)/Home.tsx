import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import MapView from 'react-native-maps';
import { Stack } from 'expo-router';

export default function Tab() {
  return (
    <View style={{ flex: 1 }}>
		  <MapView style={StyleSheet.absoluteFill} />
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