import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 50,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    marginHorizontal: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
  },
  clickable: {
    padding: 8,
  },
  clickableText: {
    fontSize: 16,
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },
});

export default function LogInForm({setLoginPage}: {setLoginPage: (x: 'login' | 'signup') => void}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthState } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    try {
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const token = response.headers.get('auth-token');
        setAuthState({ token, authenticated: true });
        router.replace('/(tabs)/Home');
        Alert.alert('Success', 'Login successful');
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.error(error)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <View style={{marginTop: 20}} />

      <Button title="Log in" onPress={handleLogin} />

      <View style={{marginTop: 20}} />

      <TouchableOpacity style={styles.clickable} onPress={() => setLoginPage('signup')}>
        <Text style={styles.clickableText}>Signup instead</Text>
      </TouchableOpacity>
    </View>
  );
}
