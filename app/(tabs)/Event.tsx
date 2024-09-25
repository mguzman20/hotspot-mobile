import { View, Text, StyleSheet } from 'react-native';
import Login from '@/app/Login';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Event</Text>
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