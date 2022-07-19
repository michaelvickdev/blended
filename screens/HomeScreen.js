import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Posts } from '../components/Posts';

// import { auth } from '../config';

export const HomeScreen = () => {
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
