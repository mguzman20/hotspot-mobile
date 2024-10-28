import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';

type Event = {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    name: string;
    category: string;
    description: string;
    img: string | null;
};

export default function EventDetail({route}) {
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
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.eventCategory}>Categoría: {event.category}</Text>
            <Text style={styles.eventLocation}>Ubicación: {event.coordinate.latitude}, {event.coordinate.longitude}</Text>
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
    imageText: {
        color: '#757575',
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
    eventLocation: {
        fontSize: 16,
        color: '#424242',
    },
    eventDescription: {
        fontSize: 16,
        color: '#424242',
    },
});
