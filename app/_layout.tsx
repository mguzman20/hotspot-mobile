import React from 'react';
import { Stack } from 'expo-router';
import AuthProvider from './context/AuthContext';

const Layout = () => (
	<AuthProvider>
		<Stack
			screenOptions={{
				headerTitle: 'HotSpot',
				headerStyle: {
					backgroundColor: '#DC1B1B', // Customize the header background color
				},
				headerTintColor: '#fff'
			}}
		>
			<Stack.Screen name='(tabs)' options={{ 
				title: 'Tabs',
				headerShown: true 
				}} />
		</Stack>
	</AuthProvider>
);

export default Layout;