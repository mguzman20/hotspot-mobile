import { View, Text } from 'react-native'
import MapView from 'react-native-maps';
import React from 'react'

const Home = () => {
    console.log("w")
    return (
        <View style={{ flex: 1 }}>
				<MapView style={StyleSheet.absoluteFill} />
		</View>
    );
};

export default Home;