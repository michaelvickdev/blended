import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { View } from './View';
import { Text } from './Text';
import { storage } from '../config';
import { ref } from 'firebase/storage';

export const ProfileHeader = ({ user, noBio }) => {
  getImage();
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
        <View style={styles.userInfo}>
          <Text bold={true} heading={true} style={{ fontSize: 18 }}>
            {user.username}
          </Text>
          <Text heading={true} style={{ fontSize: 18 }}>
            {user.username}, {user.city}
          </Text>
          <Text heading={true} style={{ fontSize: 18 }}>
            {getAge(user.dateOfBirth)}, {user.gender}
          </Text>
        </View>
      </View>
      {!noBio && (
        <View style={styles.status}>
          <Text style={{ fontSize: 16, textAlign: 'center' }}>{user.about}</Text>
        </View>
      )}
    </View>
  );
};

const getImage = async (url) => {
  const image = ref(storage, url);
  console.log(image);
};

const getAge = (dateString) => {
  const date = dateString.split('-');
  const today = new Date();
  const birthDate = new Date(date[2], date[1], date[0]);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  userInfo: {
    paddingLeft: 16,
    justifyContent: 'center',
  },
  avatarImage: {
    width: 95,
    height: 95,
    borderRadius: 85 / 2,
  },
  status: {
    marginVertical: 20,
  },
});
