import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, Text } from '../components';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';

export const SettingScreen = ({ navigation }) => {
  return (
    <LinearGradient style={styles.container} colors={[Colors.mainFirst, Colors.mainSecond]}>
      <SingleItem title="Favourites" path="Next" icon="heart" navigation={navigation} />
      <SingleItem title="Notifications" path="Next" icon="update" navigation={navigation} />
      <SingleItem title="Change Password" path="Next" icon="shield-edit" navigation={navigation} />
      <SingleItem
        title="Help/Comment/Report"
        path="Next"
        icon="help-circle"
        navigation={navigation}
      />
    </LinearGradient>
  );
};

const SingleItem = ({ title, icon, path, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate(path, { initial: false })}
    >
      <Icon name={icon} color={Colors.black} size={24} />
      <Text style={styles.itemText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  itemText: {
    fontSize: 18,
    marginLeft: 16,
  },
});
