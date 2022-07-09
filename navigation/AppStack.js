import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { HomeScreen } from '../screens';
import { SideBarContent } from './SideBarContent';
import { ProfileStack } from './ProfileStack';
import { BlankScreen } from './BlankScreen';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
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
          marginLeft: -15,
          color: Colors.trueBlack,
        },
        drawerItemStyle: {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: Colors.white,
          marginTop: 0,
          marginBottom: 0,
          paddingVertical: 2.5,
          borderRadius: 0,
        },
        unmountOnBlur: true,
      }}
    >
      <Drawer.Screen
        name="Feeds"
        component={HomeScreen}
        options={(props) => ({
          drawerIcon: () => <MaterialIcons name="rss-feed" size={24} color={Colors.black} />,
          headerTitle: () => <Header {...props} />,
        })}
      />
      <Drawer.Screen
        name="Events"
        component={BlankScreen}
        options={(props) => ({
          drawerLabel: 'Events',
          drawerIcon: () => <MaterialIcons name="timer" size={24} color={Colors.black} />,
          headerTitle: () => <Header {...props} />,
        })}
      />
      <Drawer.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={(props) => ({
          drawerLabel: 'View Profile',
          drawerIcon: () => <MaterialIcons name="person" size={24} color={Colors.black} />,
          headerTitle: () => <Header {...props} />,
        })}
      />
      <Drawer.Screen
        name="Search"
        component={SearchScreen}
        options={(props) => ({
          drawerIcon: () => <MaterialIcons name="search" size={24} color={Colors.black} />,
          headerTitle: () => <Header {...props} />,
        })}
      />
      <Drawer.Screen
        name="Near By"
        component={BlankScreen}
        options={(props) => ({
          drawerLabel: 'Near By',
          drawerIcon: () => <MaterialIcons name="location-pin" size={24} color={Colors.black} />,
          headerTitle: () => <Header {...props} />,
        })}
      />
      <Drawer.Screen
        name="My Friends"
        component={BlankScreen}
        options={(props) => ({
          drawerLabel: 'My Friends',
          drawerIcon: () => (
            <MaterialCommunityIcons
              name="dots-circle"
              size={22}
              color={Colors.black}
              style={{ marginLeft: 1 }}
            />
          ),
          headerTitle: () => <Header {...props} />,
        })}
      />
      <Drawer.Screen
        name="My Feeds"
        component={BlankScreen}
        options={(props) => ({
          drawerLabel: 'My Feeds',
          drawerIcon: () => (
            <MaterialCommunityIcons
              name="image-multiple"
              size={22}
              color={Colors.black}
              style={{ marginLeft: 1 }}
            />
          ),
          headerTitle: () => <Header {...props} />,
        })}
      />
      <Drawer.Screen
        name="Messages"
        component={BlankScreen}
        options={(props) => ({
          drawerLabel: 'Messages',
          drawerIcon: () => (
            <MaterialCommunityIcons name="android-messages" size={24} color={Colors.black} />
          ),
          headerTitle: () => <Header {...props} />,
        })}
      />
      <Drawer.Screen
        name="Settings"
        component={BlankScreen}
        options={(props) => ({
          drawerLabel: 'Settings',
          drawerIcon: () => <MaterialIcons name="settings" size={24} color={Colors.black} />,
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
