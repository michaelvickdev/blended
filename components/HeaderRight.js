import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../config';
import { Text } from './Text';
import { View } from './View';
import { TouchableOpacity } from 'react-native';
import { Icon } from './Icon';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

export const HeaderRight = ({ navigation, route }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          if (getRoute(route)) {
            navigation.navigate(getRoute(route));
          }
        }}
      >
        <Icon name={getIcon(route)} size={24} color={Colors.black} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginRight: 15,
  },
});

const getIcon = (route) => {
  const current = !!getFocusedRouteNameFromRoute(route)
    ? getFocusedRouteNameFromRoute(route)
    : route.name;

  switch (current) {
    case 'Feeds':
      return 'reload';
    case 'EditProfile':
      return 'close';
    case 'Profile':
    case 'ProfileStack':
      return 'account-edit';
    case 'MyFeedsStack':
    case 'MyFeeds':
      return 'pencil-plus';
    case 'AddFeed':
      return 'close';
    default:
      return false;
  }
};

const getRoute = (route) => {
  const current = !!getFocusedRouteNameFromRoute(route)
    ? getFocusedRouteNameFromRoute(route)
    : route.name;

  switch (current) {
    case 'Profile':
    case 'ProfileStack':
      return 'EditProfile';
    case 'EditProfile':
      return 'Profile';
    case 'MyFeedsStack':
    case 'MyFeeds':
      return 'AddFeed';
    case 'AddFeed':
      return 'MyFeeds';
    default:
      return false;
  }
};
