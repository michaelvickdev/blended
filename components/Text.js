import React from 'react';
import { Text as RNText } from 'react-native';
import { LoadingIndicator } from './LoadingIndicator';

export const Text = ({ bold, style, children, heading }) => {
  const fontFamily = heading
    ? bold
      ? 'poppinsBold'
      : 'poppinsLight'
    : bold
    ? 'futuraBold'
    : 'futura';

  return (
    <RNText
      style={[
        {
          fontFamily: fontFamily,
          fontWeight: bold ? 'bold' : 'normal',
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};
