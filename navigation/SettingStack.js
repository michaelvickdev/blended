import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingScreen } from '../screens/SettingScreen';
import { FavouriteScreen } from '../screens/FavouriteScreen';
import { UserProfile } from '../screens/UserProfile';
import { ChangePassword } from '../screens/ChangePassword';
import { SupportScreen } from '../screens/SupportScreen';
import { NotificationScreen } from '../screens/NotificationScreen';

const Stack = createStackNavigator();

export const SettingStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Settings" component={SettingScreen} />
      <Stack.Screen name="Favourite" component={FavouriteScreen} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="SupportScreen" component={SupportScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
};
