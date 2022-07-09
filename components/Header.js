import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../config';
import { Text } from '../components/Text';
import { View } from '../components/View';
import { TouchableOpacity } from 'react-native';
import { Icon } from '../components/Icon';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

export const Header = ({ navigation, route }) => {
  return (
    <View style={styles.Header}>
      <Text heading={true} style={styles.headerTitle} bold={true}>
        {getTitle(route)}
      </Text>
      <TouchableOpacity
        onPress={() => {
          if (getRoute(route)) {
            navigation.navigate(getRoute(route));
          }
        }}
      >
        <Icon
          name={getIcon(route)}
          size={24}
          color={Colors.black}
          style={styles.Icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    color: Colors.skyBlue,
    fontSize: 18,
    fontWeight: '200',
  },
  Header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
      return false;
  }
};

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
    default:
      return false;
  }
};
