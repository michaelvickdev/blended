import React from 'react';
import { Text as RNText } from 'react-native';
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

export const Text = ({ bold, style, children }) => {
  return (
    <RNText
      style={{
        fontFamily: bold ? 'Poppins_700Bold' : 'Poppins_400Regular',
        fontWeight: bold ? 'bold' : 'normal',
        ...style,
      }}
    >
      {children}
    </RNText>
  );
};
