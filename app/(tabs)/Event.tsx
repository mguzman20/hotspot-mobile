import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Events from '../pages/Events';
import EventDetail from '../pages/EventDetail';
import EventForm from '../pages/EventForm';

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
                            <AntDesign
                                style={{ marginRight: 15 }}
                                name="pluscircleo"
                                size={24}
                                color="black"
                                onPress={() => navigation.navigate('EventForm')}
                            />
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
