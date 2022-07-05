import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export const MyProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text>My Profile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
