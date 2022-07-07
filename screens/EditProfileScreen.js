import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileHeader } from '../components/ProfileHeader';
import { Colors } from '../config';
import { fakeData } from '../assets/fakeData';

export const EditProfileScreen = () => {
  return (
    <LinearGradient
      style={styles.container}
      colors={[Colors.mainFirst, Colors.mainSecond]}
    >
      <ProfileHeader user={fakeData[0].user} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
