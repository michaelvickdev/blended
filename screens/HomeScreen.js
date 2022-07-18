import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Posts } from '../components/Posts';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';

// import { auth } from '../config';

export const HomeScreen = () => {
  // const handleLogout = () => {
  //   signOut(auth).catch((error) => console.log('Error logging out: ', error));
  // };
  const { user } = useContext(AuthenticatedUserContext);
  console.log(user);
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
