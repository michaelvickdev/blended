import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Colors } from '../config';
import { Text } from './Text';

export const Button = ({
  children,
  onPress,
  activeOpacity = 0.3,
  borderless = false,
  title,
  style,
  borderlessTitleStyle,
}) => {
  const _style = useCallback(({ pressed }) => [style, { opacity: pressed ? activeOpacity : 1 }]);

  if (borderless) {
    return (
      <Pressable onPress={onPress} style={_style}>
        <Text
          bold={true}
          style={
            borderlessTitleStyle
              ? [styles.borderlessButtonText, borderlessTitleStyle]
              : styles.borderlessButtonText
          }
        >
          {title}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={_style}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  borderlessButtonText: {
    fontSize: 16,
    color: Colors.primary,
  },
});
