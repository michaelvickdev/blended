import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Posts } from '../components/Posts';

import { auth } from '../config';

export const HomeScreen = () => {
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log('Error logging out: ', error));
  };
  return (
    <View style={styles.container}>
      <Posts />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
