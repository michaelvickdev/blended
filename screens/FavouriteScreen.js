import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../components/Text';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config';
import { AuthenticatedUserContext } from '../providers';
import { getImage } from '../hooks/getImage';

export const FavouriteScreen = ({ navigation }) => {
  const mountedRef = useRef(true);
  const { user } = useContext(AuthenticatedUserContext);
  const [noFav, setNoFav] = useState(false);
  const [users, setUsers] = useState([]);

  const goToProfile = (uid) => {
    navigation.navigate('UserProfile', { uid: uid });
  };

  const setUserData = async () => {
    const usersQuery = doc(db, 'users', user.uid);
    const usersSnapshot = await getDoc(usersQuery);
    const usersData = usersSnapshot.data();

    if ('favourites' in usersData && usersData.favourites.length > 0) {
      usersData.favourites.forEach(async (uid) => {
        let singleQuery = doc(db, 'users', uid);
        let singleSnap = await getDoc(singleQuery);
        let singleData = singleSnap.data();
        if (mountedRef.current) {
          setUsers((prev) => [...prev, singleData]);
        }
      });
    } else if (mountedRef.current) {
      setNoFav(true);
    }
  };

  useEffect(() => {
    setUserData();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      {users && users.length > 0 && (
        <ScrollView
          style={styles.container}
          automaticallyAdjustsScrollIndicatorInsets={false}
          scrollIndicatorInsets={{ right: Number.MIN_VALUE }}
        >
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
      )}
      {noFav && (
        <Text style={{ textAlign: 'center', marginTop: 16, fontSize: 16 }}>
          You have no favourites yet.
        </Text>
      )}

      {!noFav && users.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 16, fontSize: 16 }}>Loading...</Text>
      )}
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
