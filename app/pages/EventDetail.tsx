import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { CampusEvent } from '../helpers/backend';
import { capitalize } from '../helpers/util';

export default function EventDetail({ route }: { route?: { params: { event: CampusEvent } } }) {
    if (route == null) return <></>
    const { event } = route.params;

    return (
        <ScrollView style={styles.container}>
            <Image
                style={styles.imagePlaceholder}
                source={{
                    uri: event.img ? event.img : 'https://www.dondeir.com/wp-content/uploads/2016/07/helados1.jpg',
                }}
                resizeMode="cover"
            />
            <Text style={styles.eventName}>{event.title}</Text>
            <Text style={styles.eventCategory}>Categoría: {capitalize(event.category)}</Text>
            
            {/* Mapa con marcador en la ubicación del evento */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: event.coordinates.latitude,
                        longitude: event.coordinates.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: event.coordinates.latitude,
                            longitude: event.coordinates.longitude,
                        }}
                        title={event.title}
                        description={event.description}
                    />
                </MapView>
            </View>
            
            <Text style={styles.eventDescription}>Descripción: {event.description}</Text>
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
