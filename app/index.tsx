import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function Page() {
	useEffect(() => {
		// Handle notifications when the app is in the foreground
		const subscription = Notifications.addNotificationReceivedListener(notification => {
		  // This is called when a notification is received while the app is in the foreground
		  Alert.alert('New Notification', notification.request.content.body ?? 'No content');
		});
	
		// Handle notifications when the app is in the background or closed
		const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
		  // This is called when a notification is clicked or responded to
		  const { title, body } = response.notification.request.content;
		  Alert.alert('Notification Clicked', `${title}: ${body}`);
		});
	
		return () => {
		  subscription.remove();
		  backgroundSubscription.remove();
		};
	  }, []);

	return <Redirect href={"/(tabs)/Home"} />;
}