
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function TabLayout() {
    const { authState } = useAuth();
    return (
    <Tabs screenOptions={{
        
        tabBarActiveTintColor: '#DC1B1B', // Set active tab text/icon color
        tabBarInactiveTintColor: '#808080', // Set inactive tab text/icon color
        headerShown: false,
    }} >
        <Tabs.Screen
            name="Home"
            options={{
            tabBarLabel: "Home",
            title: "Home",
            tabBarIcon: ({ color }) => (
                <FontAwesome
                  size={28}
                  style={{ marginBottom: -3 }}
                  name="home"
                  color={color}
                />
              ),
            }}
        />
        <Tabs.Screen
            name="Event"
            options={{
            tabBarLabel: "Eventos",
            title: "Eventos",
            tabBarIcon: ({ color }) => (
                <MaterialIcons name="event" size={24} color={color} />
              ),
            }}
        />
        <Tabs.Screen
            name="LogIn"
            options={{
            tabBarLabel: "LogIn",
            title: "LogIn",
            href: authState.authenticated ? null : '/(tabs)/LogIn',
            tabBarIcon: ({ color }) => (
                <AntDesign name="login" size={24} color={color} />
              ),
            }}
        />
        <Tabs.Screen
            name="Profile"
            options={{
            tabBarLabel: "Perfil",
            title: "Perfil",
            href: authState.authenticated ? '/(tabs)/Profile' : null,
            tabBarIcon: ({ color }) => (
                <FontAwesome name="user" size={24} color={color} />
              ),
            }}
        />
        <Tabs.Screen
            name="Notifications"
            options={{
            tabBarLabel: "Notificaciones",
            title: "Notificaciones",
            tabBarIcon: ({ color }) => (
                <AntDesign name="notification" size={24} color={color} />
              ),
            }}
        />
        <Tabs.Screen
            name="Menu"
            options={{
            tabBarLabel: "Menu",
            title: "Menu",
            tabBarIcon: ({ color }) => (
                <AntDesign name="menufold" size={24} color={color} />
              ),
            }}
        />  
    </Tabs>
  );
}
