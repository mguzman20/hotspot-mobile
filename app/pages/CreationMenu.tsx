import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function CreationMenu({ navigation }: { navigation: any }) {
  const { authState } = useAuth();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => {
        if (authState.authenticated) {
          navigation.navigate("EventForm")
        } else {
            Alert.alert("Inicia sesión para crear eventos!")
        }
      }}>
        <Text style={styles.buttonText}>Crear evento</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}  onPress={() => {
        if (authState.authenticated) {
          navigation.navigate("LocationForm")
        } else {
            Alert.alert("Inicia sesión para crear lugares!")
        }
      }}>
        <Text style={styles.buttonText}>Crear lugar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 15,
    width: '80%', 
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 18,
    fontWeight: 'bold',
  },
});