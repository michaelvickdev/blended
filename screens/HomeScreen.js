import React, { useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Posts } from '../components/Posts';
import { AuthenticatedUserContext } from '../providers';
import * as Location from 'expo-location';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config';

export const HomeScreen = () => {
  const { user } = useContext(AuthenticatedUserContext);

  const getCurrentLoc = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      coord: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  };
  useEffect(() => {
    getCurrentLoc();
  }, []);

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
