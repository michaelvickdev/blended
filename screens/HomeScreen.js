import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Posts } from '../components/Posts';
import { signOut } from 'firebase/auth';

import { auth } from '../config';

export const HomeScreen = () => {
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log('Error logging out: ', error));
  };
  return (
    <View style={styles.container}>
      {/* <Button title='Sign Out' onPress={handleLogout} /> */}
      <Posts />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
