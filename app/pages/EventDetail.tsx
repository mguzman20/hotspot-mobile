import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { backendFetch, CampusEvent } from '../helpers/backend';
import { capitalize } from '../helpers/util';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function EventDetail({ route }: { route?: { params: { event: CampusEvent } } }) {
    if (route == null) return <></>
    const { event } = route.params;
    const { authState, reloadSpots } = useAuth()

    console.log("event details: ", event)
    console.log("user id", authState.userId)

    // HACK: expo 52 qlo
    const [showMap, setShowMap] = useState(false)
    useEffect(() => {
        setTimeout(() => setShowMap(true), 1000)
    }, [])

    const onLikeChange = async (like: boolean) => {
        console.log('liking ', event._id)
        await backendFetch({
            route: `/events/${like ? 'like' : 'dislike'}`,
            method: 'POST',
            token: authState.token,
            body: {
                eventId: event._id,
            },
            handleErr: {
                alertTitle: `${like ? 'Like' : 'Dislike'} failed`,
            },
            rawResponse: true,
        })
        await reloadSpots()
    }

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

            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
            }}>
                <TouchableOpacity onPress={() => {
                    onLikeChange(true)
                }}>
                    <FontAwesome name="thumbs-up" color={'gray'} size={40} style={{
                        margin: 10,
                    }} />
                </TouchableOpacity>
                <Text>
                    {event.points.length - event.negpoints.length}
                </Text>
                <TouchableOpacity onPress={() => {
                    onLikeChange(false)
                }}>
                    <FontAwesome name="thumbs-down" color="gray" size={40} style={{
                        margin: 10,
                    }} />
                </TouchableOpacity>
            </View>

            {/* Mapa con marcador en la ubicación del evento */}
            <View style={styles.mapContainer}>
                {showMap && <MapView
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
                </MapView>}
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
