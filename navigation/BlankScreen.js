import * as React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

export const BlankScreen = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{route.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  text: {
    textAlign: 'center',
  },
});
