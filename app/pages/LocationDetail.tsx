import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { CampusEvent, CampusLocation } from '../helpers/backend';
import { capitalize } from '../helpers/util';

export default function LocationDetail({ route }: { route?: { params: { location: CampusLocation } } }) {
    if (route == null) return <></>
    const { location } = route.params;

    // HACK: expo 52 qlo
    const [showMap, setShowMap] = useState(false)
    useEffect(() => {
        setTimeout(() => setShowMap(true), 1000)
    }, [])

    return (
        <ScrollView style={styles.container}>
            <Image
                style={styles.imagePlaceholder}
                source={{
                    uri: location.img ? location.img : 'https://www.dondeir.com/wp-content/uploads/2016/07/helados1.jpg',
                }}
                resizeMode="cover"
            />
            <Text style={styles.eventName}>{location.title}</Text>
            <Text style={styles.eventCategory}>Categoría: {capitalize(location.category)}</Text>

            {/* Mapa con marcador en la ubicación del evento */}
            <View style={styles.mapContainer}>
                {showMap && <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.coordinates.latitude,
                        longitude: location.coordinates.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: location.coordinates.latitude,
                            longitude: location.coordinates.longitude,
                        }}
                        title={location.title}
                        description={location.description}
                    />
                </MapView>}
            </View>

            <Text style={styles.eventDescription}>Descripción: {location.description}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    imagePlaceholder: {
        height: 200,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    eventName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    eventCategory: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#757575',
        marginBottom: 16,
    },
    mapContainer: {
        height: 200,
        width: '100%',
        marginBottom: 16,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    eventDescription: {
        fontSize: 16,
        color: '#424242',
    },
});
