import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { HomeScreen } from '../screens';
import { SideBarContent } from './SideBarContent';
import { ProfileStack } from './ProfileStack';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../config';
import { Header } from '../components/Header';
import { HeaderRight } from '../components/HeaderRight';
import { SearchStack } from './SearchStack';
import { MyFeedsScreen } from '../screens/MyFeedsScreen';
import { NearByScreen } from '../screens/NearByScreen';
import { MessagesStack } from '../screens/MessagesScreen';
import { EventsScreen } from '../screens/EventsScreen';
import { FriendsStack } from './FriendsStack';
import { SettingStack } from './SettingStack';
import { PaymentScreen } from '../screens/PaymentScreen';

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
        headerTitleAlign: 'left',
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
        name="Home"
        component={HomeScreen}
        options={(props) => ({
          drawerIcon: () => <MaterialIcons name="rss-feed" size={24} color={Colors.black} />,
          headerTitle: () => <Header {...props} />,
          headerRight: () => <HeaderRight {...props} />,
          headerShown: getFocusedRouteNameFromRoute(props.route) === 'Comments' ? false : true,
        })}
      />
      <Drawer.Screen
        name="Events"
        component={EventsScreen}
        options={(props) => ({
          drawerLabel: 'Events',
          drawerIcon: () => <MaterialIcons name="timer" size={24} color={Colors.black} />,
          headerTitle: () => <Header {...props} />,
          headerRight: () => <HeaderRight {...props} />,
        })}
      />
      <Drawer.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={(props) => ({
          drawerLabel: 'View Profile',
          drawerIcon: () => <MaterialIcons name="person" size={24} color={Colors.black} />,
          headerTitle: () => <Header {...props} />,
          headerRight: () => <HeaderRight {...props} />,
        })}
      />
      <Drawer.Screen
        name="SearchStack"
        component={SearchStack}
        options={(props) => ({
          drawerLabel: 'Search',
          drawerIcon: () => <MaterialIcons name="search" size={24} color={Colors.black} />,
          headerTitle: () => <Header {...props} />,
          headerRight: () => <HeaderRight {...props} />,
        })}
      />
      <Drawer.Screen
        name="Near By"
        component={NearByScreen}
        options={(props) => ({
          drawerLabel: 'Near By',
          drawerIcon: () => <MaterialIcons name="location-pin" size={24} color={Colors.black} />,
          headerTitle: () => <Header {...props} />,
          headerRight: () => <HeaderRight {...props} />,
        })}
      />
      <Drawer.Screen
        name="FriendsStack"
        component={FriendsStack}
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
          headerRight: () => <HeaderRight {...props} />,
        })}
      />
      <Drawer.Screen
        name="MyFeedsStack"
        component={MyFeedsScreen}
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
          headerRight: () => <HeaderRight {...props} />,
          headerShown: getFocusedRouteNameFromRoute(props.route) === 'Comments' ? false : true,
        })}
      />
      <Drawer.Screen
        name="MessagesStack"
        component={MessagesStack}
        options={(props) => ({
          drawerLabel: 'Messages',
          drawerIcon: () => (
            <MaterialCommunityIcons name="android-messages" size={24} color={Colors.black} />
          ),
          headerTitle: () => <Header {...props} />,
          headerRight: () => <HeaderRight {...props} />,
          headerShown: getFocusedRouteNameFromRoute(props.route) === 'Chats' ? false : true,
        })}
      />

      <Drawer.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={(props) => ({
          drawerLabel: 'Buy Subscription',
          drawerIcon: () => (
            <MaterialCommunityIcons
              name="card-account-details-star"
              size={24}
              color={Colors.black}
            />
          ),
          headerTitle: () => <Header {...props} />,
          headerRight: () => <HeaderRight {...props} />,
        })}
      />

      <Drawer.Screen
        name="SettingStack"
        component={SettingStack}
        options={(props) => ({
          drawerLabel: 'Settings',
          drawerIcon: () => <MaterialIcons name="settings" size={24} color={Colors.black} />,
          headerTitle: () => <Header {...props} />,
          headerRight: () => <HeaderRight {...props} />,
        })}
      />
    </Drawer.Navigator>
  );
};
