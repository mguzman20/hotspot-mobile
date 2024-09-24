import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home'
import Login from './Login'
import AuthProvider from './context/AuthContext'

const Stack = createNativeStackNavigator();

export default function Page() {
	return (
		<AuthProvider>
			<Layout></Layout>
		</AuthProvider>
	);
}

export const Layout = () => {
	const { authState, onLogout} = useAuth();
	return (
	<NavigationContainer>
		<Stack.Navigator>
		{ authState?.authenticated ? (
			<Stack.Screen 
			name="Home" 
			component={Home}
			options={{
				headerRight: () => <Button onPress={onLogout} title="SignOut"/>,
			}}></Stack.Screen>
		):(
			<Stack.Screen name='Login' component={Login}></Stack.Screen>
		)}
		</Stack.Navigator>
	</NavigationContainer>
	);
};