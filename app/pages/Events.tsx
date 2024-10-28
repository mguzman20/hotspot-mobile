import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const events = [
    {coordinate: { latitude: -33.495314, longitude: -70.604986 }, name: "Helao", category: 'Comida', description: lorem, img: "https://www.dondeir.com/wp-content/uploads/2016/07/helados1.jpg"},
    {coordinate: { latitude: -33.495714, longitude: -70.605286 }, name: "Pizza", category: 'Comida', description: lorem, img: "https://www.laespanolaaceites.com/wp-content/uploads/2019/06/pizza-con-chorizo-jamon-y-queso-1080x671.jpg"},
    { coordinate: { latitude: -33.496714, longitude: -70.605286 }, name: 'Pizzas', category: 'Comida', description: lorem, img: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Eataly_Las_Vegas_-_Feb_2019_-_Sarah_Stierch_12.jpg"},
    { coordinate: { latitude: -33.495714, longitude: -70.604286 }, name: 'Evento B', category: 'Charla', description: lorem, img: null },
    { coordinate: { latitude: -33.496714, longitude: -70.604286 }, name: 'Evento C', category: 'Concierto', description: lorem, img: null },
];

export default function Events({ navigation }: { navigation: any }) {

    const handleCardPress = (event: { coordinate: { latitude: number; longitude: number }; name: string; category: string; description: string; img: string | null }) => {
        navigation.navigate('EventDetail', { event });
    };

    return (
        <ScrollView style={styles.container}>
            {events.map((event, index) => (
                <TouchableOpacity key={index} onPress={() => handleCardPress(event)}>
                    <View style={styles.card}>
                        <Image
                            style={styles.imagePlaceholder}
                            source={{
                                uri: event.img ? event.img : 'https://www.dondeir.com/wp-content/uploads/2016/07/helados1.jpg',
                            }}
                            resizeMode="cover"
                        />
                        <Text style={styles.eventName}>{event.name}</Text>
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
});
