import { View, StyleSheet } from 'react-native';
import React from 'react';
import CampusMap from '../pages/CampusMap';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LocationForm from '../pages/LocationForm';

export default function Tab() {

  const Stack = createStackNavigator();
  return (
    <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="Map">
        <Stack.Screen 
        name="Map" 
        component={CampusMap}
        options={{headerShown: false}} />
        <Stack.Screen
                    name="LocationForm"
                    component={LocationForm}
                    options={{ title: 'Crear Location' }}
                />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});