import { View, StyleSheet } from 'react-native';
import React from 'react';
import CampusMap from '../pages/CampusMap';

export default function Tab() {
  return (
    <View style={{ flex: 1 }}>
      <CampusMap />
  	</View>
  );
}

const styles = StyleSheet.create({
  
});