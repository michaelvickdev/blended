import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../config';
import { View } from './View';
import { TouchableOpacity } from 'react-native';
import { Icon } from './Icon';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { AuthenticatedUserContext } from '../providers';

export const HeaderRight = ({ navigation, route }) => {
  const { setFeedReload } = React.useContext(AuthenticatedUserContext);
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => getPressFunction(route, navigation, setFeedReload)()}>
        <Icon name={getIcon(route)} size={24} color={Colors.black} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginRight: 16,
  },
});

const getIcon = (route) => {
  const current = getFocusedRouteNameFromRoute(route)
    ? getFocusedRouteNameFromRoute(route)
    : route.name;

  switch (current) {
    case 'Feeds':
    case 'Home':
      return 'reload';
    case 'EditProfile':
    case 'Comments':
    case 'Favourite':
    case 'SupportScreen':
    case 'ChangePassword':
    case 'Notification':
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

const getPressFunction = (route, navigation, setFeedReload) => {
  const current = getFocusedRouteNameFromRoute(route)
    ? getFocusedRouteNameFromRoute(route)
    : route.name;

  switch (current) {
    case 'Profile':
    case 'ProfileStack':
      return () => navigation.navigate('EditProfile');
    case 'EditProfile':
      return () => navigation.navigate('Profile');
    case 'MyFeedsStack':
    case 'MyFeeds':
      return () => navigation.navigate('AddFeed');
    case 'AddFeed':
      return () => navigation.navigate('MyFeeds');
    case 'Comments':
      return () => navigation.goBack();
    case 'Feeds':
    case 'Home': {
      return () => setFeedReload((prev) => prev + 1);
    }
    case 'Favourite':
    case 'SupportScreen':
    case 'ChangePassword':
    case 'Notification':
      return () => navigation.navigate('Settings');
    default:
      return () => {};
  }
};
