import { View, StyleSheet } from 'react-native';
import React from 'react';
import CampusMap from '../pages/CampusMap';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreationMenu from '../pages/CreationMenu';
import EventForm from '../pages/EventForm';
import LocationForm from '../pages/LocationForm';

export default function Tab() {

  const Stack = createStackNavigator();
  return (
    <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="Mapa">
        <Stack.Screen 
        name="Mapa" 
        component={CampusMap}
        options={{headerShown: false}} />
        <Stack.Screen
                    name="CreationMenu"
                    component={CreationMenu}
                    options={{ title: 'Menu creación' }}
                />
        <Stack.Screen
                    name="EventForm"
                    component={EventForm}
                    options={{ title: 'Crear Evento' }}
                />
        <Stack.Screen
                    name="LocationForm"
                    component={LocationForm}
                    options={{ title: 'Crear Lugar' }}
                />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});