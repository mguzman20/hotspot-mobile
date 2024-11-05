import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Events from '../pages/Events';
import EventDetail from '../pages/EventDetail';

const Stack = createStackNavigator();

export default function Tab() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="Events">
                <Stack.Screen
                    name="Events"
                    component={Events}
                    options={{ title: 'Eventos' }}
                />
                <Stack.Screen
                    name="EventDetail"
                    component={EventDetail}
                    options={{ title: 'Detalle del Evento' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
