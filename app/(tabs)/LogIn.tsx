import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LogInForm from '../pages/LogInForm';

const styles = StyleSheet.create({

});

export default function Tab() {
  const [loginPage, setLoginPage] = useState<'login' | 'signup'>('login')
  return (
    <View style={{flex: 1}}>
      {loginPage == 'login' ? <LogInForm setLoginPage={setLoginPage} /> : <Text>hola</Text>}
    </View>
  );
}
