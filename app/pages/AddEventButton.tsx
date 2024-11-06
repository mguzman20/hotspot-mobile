import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, Alert } from 'react-native';
import { CampusEvent } from '../helpers/backend';
import { useNavigation } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAuth } from '../context/AuthContext';

export default function AddEventButton({ navigation }: { navigation: any }) {
    const { authState } = useAuth();
    return (
        <AntDesign
            style={{ marginRight: 15 }}
            name="pluscircleo"
            size={24}
            color="black"
            onPress={() => {
                if (authState.authenticated) {
                    navigation.navigate('EventForm')
                } else {
                    Alert.alert("Inicia sesión para crear eventos!")
                }
            }}
        />
    );
}
