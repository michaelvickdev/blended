import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { HomeScreen } from '../screens';
import { SideBarContent } from './SideBarContent';
import { MyProfileScreen } from '../screens/MyProfileScreen';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../config';
import { Text } from '../components/Text';
import { View } from '../components/View';
import { TouchableOpacity } from 'react-native';
import { Icon } from '../components/Icon';
import { Dimensions } from 'react-native';

const Drawer = createDrawerNavigator();

export const AppStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SideBarContent {...props} />}
      screenOptions={{
        headerTintColor: '#17A9FD',
        headerStyle: {
          backgroundColor: Colors.mainFirst,
        },
        drawerActiveTintColor: Colors.black,
        drawerInactiveTintColor: Colors.black,
      }}
    >
      <Drawer.Screen
        name="Feed"
        component={HomeScreen}
        options={{
          drawerIcon: () => (
            <MaterialIcons name="rss-feed" size={24} color={Colors.black} />
          ),
          headerTitle: () => (
            <View style={styles.Header}>
              <Text style={styles.headerTitle} bold={true}>
                Feeds
              </Text>
              <TouchableOpacity>
                <Icon
                  name="reload"
                  size={24}
                  color={Colors.black}
                  style={styles.Icon}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={MyProfileScreen}
        options={{
          drawerIcon: () => (
            <MaterialIcons name="person" size={24} color={Colors.black} />
          ),
          headerTitle: () => (
            <View style={styles.Header}>
              <Text style={styles.headerTitle} bold={true}>
                My Profile
              </Text>
              <TouchableOpacity>
                <Icon
                  name="square-edit-outline"
                  size={24}
                  color={Colors.black}
                  style={styles.Icon}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    flex: 1,
    color: '#17A9FD',
    fontSize: 20,
  },
  Header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
