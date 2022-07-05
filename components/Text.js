import React from 'react';
import { Text as RNText } from 'react-native';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

export const Text = ({ bold, style, children }) => {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <RNText
      style={[
        {
          fontFamily: bold ? 'Poppins_700Bold' : 'Poppins_400Regular',
          fontWeight: bold ? 'bold' : 'normal',
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};
