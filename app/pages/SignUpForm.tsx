import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export const styles = StyleSheet.create({
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
  error: {
    color: 'red',
    marginBottom: 8,
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

export default function SignUpForm({setLoginPage}: {setLoginPage: (x: 'login' | 'signup') => void}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const { setAuthState } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    if (!name) return Alert.alert('Error', 'Please enter your name');
    if (!email) return Alert.alert('Error', 'Please enter your email');
    if (!password) return Alert.alert('Error', 'Please enter your password');
    if (!passwordRepeat) return Alert.alert('Error', 'Please enter your password twice');

    if (password !== passwordRepeat) {
        Alert.alert('Error', "Passwords don't match!");
        return;
    }
    
    try {
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/user/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setLoginPage('login')
        Alert.alert('Success', 'Account created successfully');
      } else {
        Alert.alert('Error', data.message || 'Signup failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        keyboardType="default"
      />

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
      
      <Text style={styles.label}>Repeat password</Text>
      <TextInput
        style={styles.input}
        placeholder="Repeat your password"
        value={passwordRepeat}
        onChangeText={setPasswordRepeat}
        secureTextEntry
        autoCapitalize="none"
      />

      <View style={{marginTop: 20}} />

      <Button title="Sign up" onPress={handleSignup} />

      <View style={{marginTop: 20}} />

      <TouchableOpacity style={styles.clickable} onPress={() => setLoginPage('login')}>
        <Text style={styles.clickableText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}
