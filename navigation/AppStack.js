import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { HomeScreen } from '../screens';
import { SideBarContent } from './SideBarContent';
import { ProfileStack } from '../navigation/ProfileStack';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../config';
import { Header } from '../components/Header';
import { SearchScreen } from '../screens/SearchScreen';

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
        drawerLabelStyle: {
          fontFamily: 'futura',
          fontSize: 16,
        },
        unmountOnBlur: true,
      }}
    >
      <Drawer.Screen
        name="Feed"
        component={HomeScreen}
        options={(props) => ({
          drawerIcon: () => (
            <MaterialIcons name="rss-feed" size={24} color={Colors.black} />
          ),
          headerTitle: () => <Header {...props} />,
        })}
      />
      <Drawer.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={(props) => ({
          drawerLabel: 'View Profile',
          drawerIcon: () => (
            <MaterialIcons name="person" size={24} color={Colors.black} />
          ),
          headerTitle: () => <Header {...props} {...props} />,
        })}
      />
      <Drawer.Screen
        name="Search"
        component={SearchScreen}
        options={(props) => ({
          drawerIcon: () => (
            <MaterialIcons name="search" size={24} color={Colors.black} />
          ),
          headerTitle: () => <Header {...props} />,
        })}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    flex: 1,
    color: Colors.skyBlue,
    fontSize: 20,
  },
  Header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
