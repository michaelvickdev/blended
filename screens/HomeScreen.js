import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Posts } from '../components/Posts';

// import { auth } from '../config';

export const HomeScreen = ({ route }) => {
  // const handleLogout = () => {
  //   signOut(auth).catch((error) => console.log('Error logging out: ', error));
  // };
  console.log(route.params);
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
