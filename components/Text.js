import React from 'react';
import { Text as RNText } from 'react-native';

export const Text = ({ bold, style, children, heading, ...props }) => {
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
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
