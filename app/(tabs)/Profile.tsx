import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';


export default function Tab() {
  const { setAuthState } = useAuth();
  const router = useRouter();


  const handleLogout = () => {
    setAuthState(state => ({ ...state, token: null, userId: null, authenticated: false }));
    router.replace('/(tabs)/Home');
    Alert.alert('Sucess', 'Logged Out!');
  }
  return (
    <View style={styles.container}>
      <Text>Perfil</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});