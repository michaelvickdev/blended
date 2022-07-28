import React from 'react';
import { StyleSheet, ScrollView, Dimensions, Linking } from 'react-native';
import { View } from '../components';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../config';
import { Text } from '../components/Text';

export const EventsScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} scrollIndicatorInsets={{ right: 0 }}>
        <SingleEvent title="Event 1" url="https://zoom.test.com" uploadDate="2020-01-01" />
      </ScrollView>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.mainFirst, Colors.mainSecond]}
      ></LinearGradient>
    </View>
  );
};

const SingleEvent = ({ title, url, uploadDate }) => (
  <View style={styles.event}>
    <Text bold={true} heading={true} style={{ fontSize: 18 }}>
      {title}
    </Text>
    <Text style={{ color: 'blue', fontSize: 16 }} onPress={() => Linking.openURL(url)}>
      {url}
    </Text>
    <Text style={{ textAlign: 'right', color: Colors.mediumGray }}>Uploaded {uploadDate}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    background: 'transparent',
    padding: 16,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: -1,
  },
  event: {
    paddingVertical: 16,
    borderColor: Colors.lightGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
