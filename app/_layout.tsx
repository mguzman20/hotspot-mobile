import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import AuthProvider from './context/AuthContext';
import { Image, Alert, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';


const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  alignItems: 'center',
	  justifyContent: 'center',
	},
	image: {
	  width: 50,
	  height: 50,
	},
  });

function LogoTitle() {
	return (
	  <Image style={styles.image} source={require("../assets/images/hotspot.png")} />
	);
  }


const Layout = () =>{

 return (
	<AuthProvider>
		<Stack
			screenOptions={{
				headerTitle: 'Hotspot',
				// headerTitle: props => <LogoTitle {...props} />,
				headerStyle: {
					backgroundColor: '#DC1B1B', // Customize the header background color
				},
				headerTintColor: '#fff'
			}}

		>
			<Stack.Screen name='(tabs)' options={{ 
				title: 'Tabs\s',
				headerShown: true 
				}} />
		</Stack>
	</AuthProvider>
);}

export default Layout;