import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput } from 'react-native-paper';
import { Text } from '../components/Text';
import { fakeData } from '../assets/fakeData';

const allUsers = fakeData.map((single) => single.user);

export const SearchScreen = () => {
  const [users, setUsers] = useState(allUsers);
  const [text, setText] = React.useState('');

  useEffect(() => {
    console.log(text);
    setUsers(allUsers.filter((single) => single.name.includes(text)));
  }, [text]);

  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <TextInput
        mode="outlined"
        value={text}
        onChangeText={(text) => setText(text)}
        placeholder="Search for users"
        outlineColor={Colors.lightGray}
        activeOutlineColor={Colors.mediumGray}
      />
      <ScrollView style={styles.container}>
        {users.map((user, index) => (
          <SingleProfile
            key={index}
            name={user.username}
            url={user.avatar}
            country={user.location}
          />
        ))}
      </ScrollView>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.mainFirst, Colors.mainSecond]}
      ></LinearGradient>
    </View>
  );
};

const SingleProfile = ({ name, url, country }) => {
  return (
    <View style={styles.profile}>
      <Image source={{ uri: url }} style={styles.image} />
      <View style={styles.textGrp}>
        <Text bold={true} heading={true} style={{ fontSize: 18 }}>
          {name}
        </Text>
        <Text heading={true}>{country}</Text>
      </View>
    </View>
  );
};

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
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 65 / 2,
  },
  textGrp: {
    marginLeft: 16,
  },
});
