import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingScreen } from '../screens/SettingScreen';
import { BlankScreen } from './BlankScreen';
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
      <Stack.Screen name="Next" component={BlankScreen} />
    </Stack.Navigator>
  );
};
