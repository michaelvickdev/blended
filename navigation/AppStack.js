import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { HomeScreen } from '../screens';
import { SideBarContent } from './SideBarContent';
import { MyProfileScreen } from '../screens/MyProfileScreen';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../config';

const Drawer = createDrawerNavigator();

export const AppStack = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <SideBarContent {...props} />}>
      <Drawer.Screen
        name="Feed"
        component={HomeScreen}
        options={{
          drawerIcon: () => (
            <MaterialIcons name="rss-feed" size={24} color="black" />
          ),
          headerTintColor: '#17A9FD',
          headerStyle: {
            backgroundColor: Colors.mainFirst,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={MyProfileScreen}
        options={{
          drawerIcon: () => (
            <MaterialIcons name="person" size={24} color="black" />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
