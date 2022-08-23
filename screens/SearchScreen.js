import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput } from 'react-native-paper';
import { Text } from '../components/Text';

import { collection, query, getDocs, limit, orderBy, where } from 'firebase/firestore';
import { db } from '../config';
import { AuthenticatedUserContext } from '../providers';
import { getImage } from '../hooks/getImage';

export const SearchScreen = ({ navigation }) => {
  const mountedRef = useRef(true);
  const { user } = useContext(AuthenticatedUserContext);
  const [users, setUsers] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [text, setText] = React.useState('');

  const goToProfile = (uid) => {
    navigation.navigate('UserProfile', { uid: uid });
  };

  const setUserData = async () => {
    const usersQuery = query(collection(db, 'users'), orderBy('dateCreated', 'desc'), limit(25));
    const usersSnapshot = await getDocs(usersQuery);
    const usersData = usersSnapshot.docs.map((doc) => doc.data());
    if (mountedRef.current) {
      setUsers(usersData);
    }
  };

  const searchUsers = async (text) => {
    const usersQuery = query(
      collection(db, 'users'),
      where('username', '>=', text.toLowerCase()),
      where('username', '<=', text.toLowerCase() + '\uf8ff'),
      limit(5)
    );
    const usersSnapshot = await getDocs(usersQuery);
    const usersData = usersSnapshot.docs.map((doc) => doc.data());
    if (mountedRef.current) {
      setSearchData(usersData);
    }
  };

  useEffect(() => {
    if (text.length > 0) {
      searchUsers(text);
    }
  }, [text]);

  useEffect(() => {
    setUserData();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        mode="outlined"
        value={text}
        style={{ marginHorizontal: 16 }}
        onChangeText={(text) => setText(text)}
        placeholder="Search for users"
        outlineColor={Colors.lightGray}
        activeOutlineColor={Colors.mediumGray}
      />
      <ScrollView
        style={styles.container}
        automaticallyAdjustsScrollIndicatorInsets={false}
        scrollIndicatorInsets={{ right: Number.MIN_VALUE }}
      >
        {text.length > 0 &&
          (searchData.length ? (
            searchData.map((singleUser, index) =>
              singleUser.uid !== user.uid ? (
                <SingleProfile
                  key={index}
                  name={singleUser.username}
                  url={singleUser.avatar}
                  location={singleUser.city}
                  navigation={navigation}
                  uid={singleUser.uid}
                  goToProfile={goToProfile}
                />
              ) : null
            )
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No users found</Text>
          ))}

        {!text.length &&
          users.map((singleUser, index) =>
            singleUser.uid !== user.uid ? (
              <SingleProfile
                key={index}
                name={singleUser.username}
                url={singleUser.avatar}
                location={singleUser.city}
                navigation={navigation}
                uid={singleUser.uid}
                goToProfile={goToProfile}
              />
            ) : null
          )}
      </ScrollView>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.mainFirst, Colors.mainSecond]}
      ></LinearGradient>
    </View>
  );
};

const SingleProfile = ({ name, url, location, goToProfile, uid }) => {
  const mountedRef = useRef(true);
  const [image, setImage] = useState(require('../assets/default-image.png'));

  useEffect(() => {
    (async () => {
      const image = await getImage(url);
      if (image && mountedRef.current) {
        setImage(image);
      }
    })();

    return () => {
      mountedRef.current = false;
    };
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
    paddingHorizontal: 16,
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
