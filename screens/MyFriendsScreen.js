import React, { useState, useEffect, useContext, useRef } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { View } from '../components';
import { Text } from '../components/Text';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-paper';

import { AuthenticatedUserContext } from '../providers';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../config';
import { getImage } from '../hooks/getImage';

export const MyFriendsScreen = ({ navigation }) => {
  const mountedRef = useRef(true);
  const [toggleTab, setToggle] = useState(true);
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const { user } = useContext(AuthenticatedUserContext);

  const getFriendData = async () => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && mountedRef.current) {
      if (docSnap.data().friends.length) {
        setFriends(docSnap.data().friends);
      }
      if (docSnap.data().requests.length) {
        setPending(docSnap.data().requests);
      }
    }
  };

  useEffect(() => {
    getFriendData();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const goToProfile = (uid) => {
    console.log(navigation);
    navigation.navigate('UserProfile', { uid: uid });
  };

  const approveReq = async (uid) => {
    const requester = doc(db, 'users', user.uid);
    const requestee = doc(db, 'users', uid);

    await updateDoc(requester, {
      friends: arrayUnion(requestee.id),
      requests: arrayRemove(requestee.id),
    });
    await updateDoc(requestee, {
      friends: arrayUnion(requester.id),
    });

    setPending(pending.filter((id) => id !== uid));
    setFriends(friends.concat(uid));
  };

  const cancelReq = async (uid) => {
    const requester = doc(db, 'users', user.uid);
    const requestee = doc(db, 'users', uid);

    await updateDoc(requestee, {
      requests: arrayRemove(requester.id),
    });
    setPending(pending.filter((id) => id !== uid));
  };

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
            {`Inner Circle \t (${friends.length})`}
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
            {`Pending \t (${pending.length})`}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container} scrollIndicatorInsets={{ right: 0 }}>
        {!toggleTab &&
          friends.map((user, index) => (
            <SingleProfile key={index} uid={user} goToProfile={goToProfile} />
          ))}
        {toggleTab &&
          pending.map((user, index) => (
            <SingleProfile
              key={index}
              uid={user}
              pending={true}
              goToProfile={goToProfile}
              cancelReq={cancelReq}
              approveReq={approveReq}
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

const SingleProfile = ({ uid, pending, goToProfile, cancelReq, approveReq }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [image, setImage] = useState(require('../assets/default-image.png'));

  useEffect(() => {
    (async () => {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
        const imgRes = await getImage(docSnap.data().avatar);
        if (imgRes) {
          setImage(imgRes);
        }
      }
    })();
  }, []);

  return (
    <TouchableOpacity style={styles.profileContainer} onPress={() => goToProfile(uid)}>
      <View style={styles.profile}>
        <Image source={image} style={styles.image} />
        <View style={styles.textGrp}>
          <Text bold={true} heading={true} style={{ fontSize: 18 }}>
            {userInfo?.username}
          </Text>
          <Text heading={true}>{userInfo?.city}</Text>
        </View>
      </View>
      {pending && (
        <View style={styles.actionBtn}>
          <Button
            mode="contained"
            color={Colors.white}
            style={styles.button}
            onPress={() => approveReq(uid)}
          >
            Approve
          </Button>
          <Button
            mode="contained"
            color={Colors.white}
            style={styles.button}
            onPress={() => cancelReq(uid)}
          >
            Cancel
          </Button>
        </View>
      )}
    </TouchableOpacity>
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
