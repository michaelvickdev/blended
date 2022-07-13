import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { View } from '../components';
import { Text } from '../components/Text';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { fakeData } from '../assets/fakeData';
import { Button } from 'react-native-paper';

const Users = fakeData.map((single) => single.user);
const Friends = Users.splice(0, Math.ceil(Users.length / 2));
const Pending = Users.splice(-Math.ceil(Users.length / 2));

export const MyFriendsScreen = () => {
  const [toggleTab, setToggle] = useState(true);
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setToggle(false)}>
          <Text
            heading={true}
            bold={true}
            style={{
              textAlign: 'center',
              color: toggleTab ? Colors.mediumGray : Colors.trueBlack,
              fontSize: 16,
            }}
          >
            {`Inner Circle \t (${Friends.length})`}
          </Text>
        </TouchableOpacity>

        <View style={styles.verticleLine}></View>

        <TouchableOpacity style={styles.tabItem} onPress={() => setToggle(true)}>
          <Text
            heading={true}
            bold={true}
            style={{
              textAlign: 'center',
              color: !toggleTab ? Colors.mediumGray : Colors.trueBlack,
              fontSize: 16,
            }}
          >
            {`Pending \t (${Pending.length})`}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        {!toggleTab &&
          Friends.map((user, index) => (
            <SingleProfile
              key={index}
              name={user.username}
              url={user.avatar}
              country={user.location}
            />
          ))}
        {toggleTab &&
          Pending.map((user, index) => (
            <SingleProfile
              key={index}
              name={user.username}
              url={user.avatar}
              country={user.location}
              pending={true}
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

const SingleProfile = ({ name, url, country, pending }) => {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.profile}>
        <Image source={{ uri: url }} style={styles.image} />
        <View style={styles.textGrp}>
          <Text bold={true} heading={true} style={{ fontSize: 18 }}>
            {name}
          </Text>
          <Text heading={true}>{country}</Text>
        </View>
      </View>
      {pending && (
        <View style={styles.actionBtn}>
          <Button mode="contained" color={Colors.white} style={styles.button}>
            Approve
          </Button>
          <Button mode="contained" color={Colors.white} style={styles.button}>
            Cancel
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    background: 'transparent',
    width: '90%',
    alignSelf: 'center',
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
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 4,
    borderRadius: 15,
  },
  tabItem: {
    flex: 1,
  },
  verticleLine: {
    height: '60%',
    width: 1,
    backgroundColor: '#909090',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 65 / 2,
  },
  textGrp: {
    marginLeft: 16,
  },
  profileContainer: {
    flex: 1,
    borderBottomWidth: 1,
    paddingVertical: 16,
    borderColor: Colors.lightGray,
  },
  actionBtn: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    margin: 4,
  },
});
