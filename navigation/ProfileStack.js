import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { MyProfileScreen } from '../screens/MyProfileScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';

const Stack = createStackNavigator();

export const ProfileStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={MyProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
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
