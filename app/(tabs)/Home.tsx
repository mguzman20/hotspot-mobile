import { View, StyleSheet } from 'react-native';
import React from 'react';
import CampusMap from '../pages/CampusMap';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreationMenu from '../pages/CreationMenu';
import EventForm from '../pages/EventForm';
import LocationForm from '../pages/LocationForm';
import EventDetail from '../pages/EventDetail';
import LocationDetail from '../pages/LocationDetail';

export default function Tab() {

  const Stack = createStackNavigator();
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Mapa">
          <Stack.Screen
            name="Mapa"
            component={CampusMap}
            options={{ headerShown: false }} />
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
            name="EventDetail"
            component={EventDetail}
            options={{ title: 'Detalle del Evento' }}
          />
          <Stack.Screen
            name="LocationDetail"
            component={LocationDetail}
            options={{ title: 'Detalle del Lugar' }}
          />
          <Stack.Screen
            name="LocationForm"
            component={LocationForm}
            options={{ title: 'Crear Lugar' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({

});