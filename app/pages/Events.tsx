import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { CampusEvent, fetchEvents } from '../helpers/event';
import { set } from 'react-hook-form';

type RootStackParamList = {
    Events: undefined;
    EventDetail: { event: CampusEvent };
};

type EventsNavigationProp = StackNavigationProp<RootStackParamList, 'Events'>;

export default function Events() {
    const navigation = useNavigation<EventsNavigationProp>();
    const [loading, setLoading] = useState(true);
    const { authState, reloadEvents } = useAuth();

    useEffect(() => {
        reloadEvents().then(() => setLoading(false))
    }, [authState.token]);

    const handleCardPress = (event: CampusEvent) => {
        navigation.navigate('EventDetail', { event });
    };

    const onRefresh = useCallback(() => {
        reloadEvents().then(() => setLoading(false));
    }, []);


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Cargando eventos...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
            style={styles.container}>
            {authState.eventList.map((event, index) => (
                <TouchableOpacity key={index} onPress={() => handleCardPress(event)}>
                    <View style={styles.card}>
                        <Image
                            style={styles.imagePlaceholder}
                            source={{
                                uri: 'https://www.dondeir.com/wp-content/uploads/2016/07/helados1.jpg',
                            }}
                            resizeMode="cover"
                        />
                        <Text style={styles.eventName}>{event.title}</Text>
                        <Text style={styles.eventCategory}>{event.category}</Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingGif: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
});
