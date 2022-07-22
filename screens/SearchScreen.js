import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput } from 'react-native-paper';
import { Text } from '../components/Text';

import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../config';
import { AuthenticatedUserContext } from '../providers';
import { getImage } from '../hooks/getImage';

export const SearchScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [users, setUsers] = useState([]);
  const [text, setText] = React.useState('');

  const goToProfile = (uid) => {
    navigation.navigate('UserProfile', { uid: uid });
  };

  useEffect(() => {
    (async () => {
      const usersQuery = query(collection(db, 'users'), where('uid', '!=', user.uid));
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map((doc) => doc.data());

      setUsers(usersData);
    })();
  }, []);

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
            location={user.city}
            navigation={navigation}
            uid={user.uid}
            goToProfile={goToProfile}
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

const SingleProfile = ({ name, url, location, goToProfile, uid }) => {
  const [image, setImage] = useState(require('../assets/default-image.png'));

  useEffect(() => {
    (async () => {
      const image = await getImage(url);
      if (image) {
        setImage(image);
      }
    })();
  }, []);
  return (
    <TouchableOpacity onPress={() => goToProfile(uid)}>
      <View style={styles.profile}>
        <Image source={image} style={styles.image} />
        <View style={styles.textGrp}>
          <Text bold={true} heading={true} style={{ fontSize: 18 }}>
            {name}
          </Text>
          <Text heading={true}>{location}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
