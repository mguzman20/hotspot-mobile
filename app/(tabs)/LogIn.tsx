import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LogInForm from '../pages/LogInForm';
import SignUpForm from '../pages/SignUpForm';

const styles = StyleSheet.create({

});

export default function Tab() {
  const [loginPage, setLoginPage] = useState<'login' | 'signup'>('signup')
  return (
    <View style={{flex: 1}}>
      {loginPage == 'login' ? <LogInForm setLoginPage={setLoginPage} /> : <SignUpForm setLoginPage={setLoginPage} />}
    </View>
  );
}
