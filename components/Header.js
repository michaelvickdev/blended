import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../config';
import { Text } from './Text';
import { View } from './View';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

export const Header = ({ route }) => {
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
  const current = getFocusedRouteNameFromRoute(route)
    ? getFocusedRouteNameFromRoute(route)
    : route.name;

  switch (current) {
    case 'Feeds':
    case 'Home':
      return 'Feeds';
    case 'EditProfile':
      return 'Edit Profile';
    case 'Profile':
    case 'ProfileStack':
      return 'My Profile';
    case 'SearchStack':
    case 'Search':
      return 'Search';
    case 'UserProfile':
      return 'User Profile';
    case 'MyFeedsStack':
    case 'MyFeeds':
      return 'My Feeds';
    case 'AddFeed':
      return 'Add Feed';
    case 'FriendsStack':
    case 'Friends':
      return 'My Friends';
    case 'MessagesStack':
    case 'Messages':
      return 'Messages';
    case 'SupportScreen':
      return 'Help and Support';
    case 'ChangePassword':
      return 'Change Password';
    case 'PaymentScreen':
      return 'Buy Subscription';
    case 'SettingStack':
      return 'Settings';
    default:
      return current;
  }
};
