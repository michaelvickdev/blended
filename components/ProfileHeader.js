import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { View } from './View';
import { Text } from './Text';

export const ProfileHeader = ({ user }) => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
        <View style={styles.userInfo}>
          <Text bold={true} heading={true} style={{ fontSize: 18 }}>
            {user.username}
          </Text>
          <Text heading={true} style={{ fontSize: 18 }}>
            {user.name}, {user.location}
          </Text>
          <Text heading={true} style={{ fontSize: 18 }}>
            {user.age}, {user.gender}
          </Text>
        </View>
      </View>
      <View style={styles.status}>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>{user.bio}</Text>
      </View>
    </View>
  );
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
