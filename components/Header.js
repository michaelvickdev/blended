import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../config';
import { Text } from './Text';
import { View } from './View';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

export const Header = ({ navigation, route }) => {
  return (
    <View>
      <Text heading={true} style={styles.headerTitle} bold={true}>
        {getTitle(route)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    color: Colors.skyBlue,
    fontSize: 18,
    fontWeight: '200',
  },
});

const getTitle = (route) => {
  const current = !!getFocusedRouteNameFromRoute(route)
    ? getFocusedRouteNameFromRoute(route)
    : route.name;

  switch (current) {
    case 'Feeds':
      return 'Feeds';
    case 'EditProfile':
      return 'Edit Profile';
    case 'Profile':
    case 'ProfileStack':
      return 'My Profile';
    case 'Search':
      return 'Search';
    default:
      return current;
  }
};
