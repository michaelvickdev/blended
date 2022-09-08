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
    try {
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
    } catch (e) {
      console.log(e);
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
    <View style={{ flex: 1 }}>
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
      <ScrollView
        style={styles.container}
        automaticallyAdjustsScrollIndicatorInsets={false}
        scrollIndicatorInsets={{ right: Number.MIN_VALUE }}
      >
        {!toggleTab &&
          (friends.length ? (
            friends.map((user, index) => (
              <SingleProfile key={index} uid={user} goToProfile={goToProfile} />
            ))
          ) : (
            <Text style={{ textAlign: 'center', padding: 16, fontSize: 16 }}>
              There are no friends.
            </Text>
          ))}
        {toggleTab &&
          (pending.length ? (
            pending.map((user, index) => (
              <SingleProfile
                key={index}
                uid={user}
                pending={true}
                goToProfile={goToProfile}
                cancelReq={cancelReq}
                approveReq={approveReq}
              />
            ))
          ) : (
            <Text style={{ textAlign: 'center', padding: 16, fontSize: 16 }}>
              There are no pending requests.
            </Text>
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
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    (async () => {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && isMounted.current) {
        setUserInfo(docSnap.data());
        const imgRes = await getImage(docSnap.data().avatar);
        if (imgRes && isMounted.current) {
          setImage(imgRes);
        }
      }
    })();

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <View style={styles.profileContainer}>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => goToProfile(uid)}>
        <View style={styles.profile}>
          <Image source={image} style={styles.image} />
          <View style={styles.textGrp}>
            <Text bold={true} heading={true} style={{ fontSize: 18 }}>
              {userInfo?.username}
            </Text>
            <Text heading={true}>{userInfo?.city}</Text>
          </View>
        </View>
      </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    background: 'transparent',
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 32,
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
    marginVertical: 16,
    paddingVertical: 8,
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
