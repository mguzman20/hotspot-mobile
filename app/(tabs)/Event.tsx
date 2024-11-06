import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Events from '../pages/Events';
import EventDetail from '../pages/EventDetail';
import EventForm from '../pages/EventForm';
import AddEventButton from '../pages/AddEventButton';

const Stack = createStackNavigator();

export default function Tab() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="Events">
                <Stack.Screen
                    name="Events"
                    component={Events}
                    options={({ navigation }) => ({
                        title: 'Eventos',
                        headerRight: () => (
                            <AddEventButton navigation={navigation} />
                        ),
                    })}
                />
                <Stack.Screen
                    name="EventDetail"
                    component={EventDetail}
                    options={{ title: 'Detalle del Evento' }}
                />
                <Stack.Screen
                    name="EventForm"
                    component={EventForm}
                    options={{ title: 'Crear Evento' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
