import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function Page() {
	console.log("e")
	return (
		<View style={{ flex: 1 }}>
			<MapView style={StyleSheet.absoluteFill} />
		</View>
	);
}