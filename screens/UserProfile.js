import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileHeader } from '../components/ProfileHeader';
import { Colors } from '../config';
import { fakeData } from '../assets/fakeData';
import PostCarouselItem from '../components/PostCarouselItem';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from '../components/View';
import { Icon } from '../components';
import { MaterialIcons } from '@expo/vector-icons';
import { SocialIcon } from 'react-native-elements';
import { Text } from '../components/Text';
import { Button } from 'react-native-paper';
import { AuthenticatedUserContext } from '../providers';

import { doc, getDoc, arrayUnion, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../config';

const data = fakeData.map((post) => post.post);

export const UserProfile = ({ route, navigation }) => {
  const [userData, setUserData] = useState(null);
  const { user } = useContext(AuthenticatedUserContext);
  const [reqSent, setReqSent] = useState(false);
  const [reqRcvd, setReqRcvd] = useState(false);
  const [friend, setFriend] = useState(false);

  const removeFriend = async () => {
    const requester = doc(db, 'users', user.uid);
    const requestee = doc(db, 'users', userData.uid);

    await updateDoc(requester, {
      friends: arrayRemove(requestee.id),
    });
    await updateDoc(requestee, {
      friends: arrayRemove(requester.id),
    });

    setFriend(false);
  };

  const addFriend = async () => {
    const requester = doc(db, 'users', user.uid);
    const requestee = doc(db, 'users', userData.uid);

    await updateDoc(requestee, {
      requests: arrayUnion(requester.id),
    });

    setReqSent(true);
  };

  const approveReq = async () => {
    const requester = doc(db, 'users', user.uid);
    const requestee = doc(db, 'users', userData.uid);

    await updateDoc(requester, {
      friends: arrayUnion(requestee.id),
      requests: arrayRemove(requestee.id),
    });
    await updateDoc(requestee, {
      friends: arrayUnion(requester.id),
    });

    setFriend(true);
  };

  const cancelReq = async () => {
    const requester = doc(db, 'users', user.uid);
    const requestee = doc(db, 'users', userData.uid);

    await updateDoc(requestee, {
      requests: arrayRemove(requester.id),
    });

    setReqSent(false);
  };

  const goToChats = async () => {
    navigation.navigate('MessagesStack', { screen: 'Chats' });
  };

  useEffect(() => {
    (async () => {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        if (docSnap.data().friends.length && docSnap.data().friends.includes(route.params.uid)) {
          setFriend(true);
        } else if (
          docSnap.data().requests.length &&
          docSnap.data().requests.includes(route.params.uid)
        ) {
          setReqRcvd(true);
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const docRef = doc(db, 'users', route.params.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        if (docSnap.data().requests.length && docSnap.data().requests.includes(user.uid)) {
          setReqSent(true);
        }
        setUserData({ ...docSnap.data(), avatar: docSnap.data().avatar });
      }
    })();
  }, []);

  return (
    <LinearGradient style={styles.container} colors={[Colors.mainFirst, Colors.mainSecond]}>
      {userData && <ProfileHeader user={{ ...userData }} />}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {data.map((post, index) => (
            <PostCarouselItem item={post} index={index} key={index} />
          ))}
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 16,
          }}
        >
          <SocialIcon type="facebook" />
          <SocialIcon type="twitter" />
          <SocialIcon type="instagram" />
          <SocialIcon type="linkedin" />
        </View>

        <View style={styles.action}>
          <TouchableOpacity style={styles.item}>
            <MaterialIcons name="person" size={12} color={Colors.black} />
            <Text style={{ marginLeft: 5, fontSize: 12 }}>Block User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Icon name="heart" size={12} color={Colors.black} />
            <Text style={{ marginLeft: 5, fontSize: 12 }}>Add to Favorite</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={friend ? removeFriend : reqRcvd ? approveReq : reqSent ? cancelReq : addFriend}
          style={styles.button}
          color={Colors.white}
          labelStyle={{ color: Colors.black }}
        >
          {friend
            ? 'Remove Friend'
            : reqRcvd
            ? 'Approve'
            : reqSent
            ? 'Cancel Request'
            : 'Add Friend'}
        </Button>
        <Button
          mode="contained"
          onPress={userData && goToChats}
          style={styles.button}
          color={Colors.white}
          textColor={Colors.black}
        >
          Send Message
        </Button>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 16,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 250,
    marginBottom: 12,
    padding: 4,
    borderRadius: 12,
  },
});
