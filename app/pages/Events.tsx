import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type Event = {
    coordinates: {
        latitude: number;
        longitude: number;
    };
    title: string;
    description: string;
    tags: string[];
    date: string;
};


type RootStackParamList = {
    Events: undefined;
    EventDetail: { event: Event };
};

type EventsNavigationProp = StackNavigationProp<RootStackParamList, 'Events'>;

export default function Events() {
    const navigation = useNavigation<EventsNavigationProp>();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/events/");
                if (!response.ok) throw new Error('Error al obtener los eventos');
                const data = await response.json();
    
                const mappedEvents: Event[] = data.map((event: any) => ({
                    coordinates: event.coordinates,
                    title: event.title,
                    description: event.description,
                    tags: event.tags || [],
                    date: event.date,
                }));
                setEvents(mappedEvents);
            } catch (error) {
                console.error(error);
                alert('Hubo un problema al cargar los eventos');
            } finally {
                setLoading(false);
            }
        };
    
        fetchEvents();
    }, []);
    
    

    const handleCardPress = (event: Event) => {
        navigation.navigate('EventDetail', { event });
    };

    if (loading) return <Text>Cargando eventos...</Text>;

    return (
        <ScrollView style={styles.container}>
            {events.map((event, index) => (
                <TouchableOpacity key={index} onPress={() => handleCardPress(event)}>
                    <View style={styles.card}>
                        <Text style={styles.eventName}>{event.title}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: Dimensions.get('window').width - 32,
    },
    imagePlaceholder: {
        height: 150,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    eventCategory: {
        fontSize: 14,
        color: '#757575',
    },
});
