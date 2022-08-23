import React from 'react';
import { StyleSheet } from 'react-native';

import { Colors } from '../config';
import { Text } from './Text';

export const FormErrorMessage = ({ error, visible }) => {
  if (!error || !visible) {
    return null;
  }

  return (
    <Text bold={true} style={styles.errorText}>
      {error}
    </Text>
  );
};

const styles = StyleSheet.create({
  errorText: {
    marginLeft: 15,
    color: Colors.red,
    fontSize: 14,
    marginBottom: 5,
  },
});
