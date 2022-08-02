import * as React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../components';
import { Colors } from '../config';

export const NotificationScreen = () => {
  return (
    <LinearGradient style={{ flex: 1, padding: 16 }} colors={[Colors.mainFirst, Colors.mainSecond]}>
      <Text style={styles.text}>There is nothing here at the moment</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});
