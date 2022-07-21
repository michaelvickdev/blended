import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MyFriendsScreen } from '../screens/MyFriendsScreen';
import { UserProfile } from '../screens/UserProfile';

const Stack = createStackNavigator();

export const FriendsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MyFriends"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MyFriends" component={MyFriendsScreen} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
    </Stack.Navigator>
  );
};
