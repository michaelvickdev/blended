import React, { useState, useContext, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Share } from 'react-native';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileHeader } from '../components/ProfileHeader';
import { Colors } from '../config';
import { PostCarouselItem } from '../components/PostCarouselItem';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from '../components/View';
import { Icon } from '../components';
import { MaterialIcons } from '@expo/vector-icons';
import { SocialIcon } from 'react-native-elements';
import { Text } from '../components/Text';
import { Button } from 'react-native-paper';
import { AuthenticatedUserContext } from '../providers';

import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import {
  doc,
  getDoc,
  arrayUnion,
  updateDoc,
  arrayRemove,
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db } from '../config';
import { getImage } from '../hooks/getImage';

export const UserProfile = ({ route, navigation }) => {
  const mountedRef = useRef(true);
  const [userData, setUserData] = useState(null);
  const { user } = useContext(AuthenticatedUserContext);
  const [reqSent, setReqSent] = useState(false);
  const [reqRcvd, setReqRcvd] = useState(false);
  const [friend, setFriend] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [feedData, setFeedData] = useState([]);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showReport, setShowReport] = useState(false);

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

  const shareUrl = async () => {
    const url = Linking.createURL('UserProfile', {
      queryParams: {
        uid: userData.uid,
      },
    });
    console.log(url);
    await Share.share({
      message: url,
    });
  };

  const reportUser = async () => {
    const docRef = doc(db, 'users', userData.uid);
    await updateDoc(docRef, {
      reports: arrayUnion({
        uid: user.uid,
        date: new Date(),
      }),
    });
    setShowReport(true);
  };

  useEffect(() => {
    if (showReport) {
      const timeOut = setTimeout(() => {
        setShowReport(false);
      }, 3000);
      return () => clearTimeout(timeOut);
    }
  }, [showReport]);

  const cancelReq = async () => {
    const requester = doc(db, 'users', user.uid);
    const requestee = doc(db, 'users', userData.uid);

    await updateDoc(requestee, {
      requests: arrayRemove(requester.id),
    });

    setReqSent(false);
  };

  const goToChats = async () => {
    navigation.navigate('MessagesStack', {
      screen: 'Chats',
      params: { uid: userData.uid },
      initial: false,
    });
  };

  const checkBlocked = async () => {
    const userRef = doc(db, 'users', route.params.uid);
    const userDoc = await getDoc(userRef);
    if (
      mountedRef.current &&
      userDoc.data().blockList?.length &&
      userDoc.data().blockList?.includes(user.uid)
    ) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Home');
      }
    }

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (
      mountedRef.current &&
      docSnap.data().blockList?.length &&
      docSnap.data().blockList?.includes(route.params.uid)
    ) {
      setIsBlocked(true);
    }
  };

  const getStatus = async () => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && mountedRef.current) {
      if (docSnap.data().friends?.length && docSnap.data().friends?.includes(route.params.uid)) {
        setFriend(true);
      } else if (
        docSnap.data().requests?.length &&
        docSnap.data().requests?.includes(route.params.uid)
      ) {
        setReqRcvd(true);
      }
      if (
        docSnap.data().favourites?.length &&
        docSnap.data().favourites?.includes(route.params.uid)
      ) {
        setIsFav(true);
      }
    }
  };

  const getFeed = async () => {
    const docRef = collection(db, 'feeds');
    const q = query(docRef, where('uid', '==', route.params.uid), orderBy('uploadDate', 'desc'));
    const docSnap = await getDocs(q);

    const feedRes = await Promise.all(
      docSnap.docs.flatMap(async (doc) =>
        !doc.data()?.isVideo ? [await getImage(doc.data().url)] : []
      )
    );

    if (mountedRef.current) setFeedData([].concat(...feedRes));
  };

  const updateGalleyImages = async () => {
    if (feedData.length) {
      if (mountedRef.current) setGalleryImages(feedData.map((item) => ({ url: item.uri })));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await checkBlocked();
      await getUserData();
      await getFeed();
      await getStatus();
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    updateGalleyImages();
  }, [feedData]);

  const setFavourite = async () => {
    const docRef = doc(db, 'users', user.uid);
    const updateObj = isFav ? arrayRemove(route.params.uid) : arrayUnion(route.params.uid);
    await updateDoc(docRef, {
      favourites: updateObj,
    });
    setIsFav((prev) => !prev);
  };

  const setBlocked = async () => {
    const docRef = doc(db, 'users', user.uid);
    const updateObj = isBlocked
      ? { blockList: arrayRemove(route.params.uid) }
      : {
          blockList: arrayUnion(route.params.uid),
          favourites: arrayRemove(route.params.uid),
          friends: arrayRemove(route.params.uid),
          requests: arrayRemove(route.params.uid),
        };
    await updateDoc(docRef, updateObj);
    if (!isBlocked) {
      updateDoc(doc(db, 'users', route.params.uid), {
        friends: arrayRemove(user.uid),
        favourites: arrayRemove(user.uid),
        requests: arrayRemove(user.uid),
      });
    } else {
      await getUserData();
    }
    setIsBlocked((prev) => !prev);
  };

  const getUserData = async () => {
    const docRef = doc(db, 'users', route.params.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && mountedRef.current && !isBlocked) {
      if (docSnap.data().requests.length && docSnap.data().requests.includes(user.uid)) {
        setReqSent(true);
      }
      setUserData({ ...docSnap.data(), avatar: docSnap.data().avatar });
    }
  };

  if (galleryVisible && galleryImages.length) {
    return (
      <Modal
        visible={true}
        transparent={true}
        onRequestClose={() => {
          setGalleryVisible(false);
        }}
      >
        <ImageViewer
          imageUrls={galleryImages}
          index={galleryIndex}
          enableSwipeDown={true}
          onSwipeDown={() => {
            if (mountedRef.current) setGalleryVisible(false);
          }}
          saveToLocalByLongPress={false}
          renderHeader={() => (
            <TouchableOpacity
              style={{ position: 'absolute', zIndex: 99, top: 38, right: 20 }}
              onPress={() => mountedRef.current && setGalleryVisible(false)}
            >
              <Icon name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
          )}
        />
      </Modal>
    );
  }

  return (
    <LinearGradient style={styles.container} colors={[Colors.mainFirst, Colors.mainSecond]}>
      {!isBlocked && userData && <ProfileHeader user={{ ...userData }} />}
      {!isBlocked && (
        <View>
          {friend && (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 20,
              }}
            >
              <Text bold={true} style={{ fontSize: 18 }}>
                Contact details:
              </Text>

              <Text style={{ fontSize: 18 }}>{userData?.phone}</Text>
            </View>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {feedData.map((post, index) => (
              <PostCarouselItem
                item={post}
                index={index}
                key={index}
                openGallery={(index) => {
                  setGalleryVisible(true);
                  setGalleryIndex(index);
                }}
              />
            ))}
          </ScrollView>

          {userData && 'socialLinks' in userData && friend && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 16,
              }}
            >
              {userData.socialLinks.facebook !== '' && (
                <SocialIcon
                  type="facebook"
                  onPress={() => Linking.openURL(userData.socialLinks.facebook)}
                />
              )}
              {userData.socialLinks.twitter !== '' && (
                <SocialIcon
                  type="twitter"
                  onPress={() => Linking.openURL(userData.socialLinks.twitter)}
                />
              )}
              {userData.socialLinks.instagram !== '' && (
                <SocialIcon
                  type="instagram"
                  onPress={() => Linking.openURL(userData.socialLinks.instagram)}
                />
              )}
              {userData.socialLinks.linkedin !== '' && (
                <SocialIcon
                  type="linkedin"
                  onPress={() => Linking.openURL(userData.socialLinks.linkedin)}
                />
              )}
            </View>
          )}
          <View style={styles.action}>
            <TouchableOpacity style={styles.item} onPress={setBlocked}>
              <MaterialIcons name="person" size={12} color={Colors.black} />
              <Text style={{ marginLeft: 5, fontSize: 12 }}>Block User</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={reportUser}>
              <MaterialIcons name="report" size={12} color={Colors.black} />
              <Text style={{ marginLeft: 5, fontSize: 12 }}>Report User</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={setFavourite}>
              <Icon name={isFav ? 'heart' : 'heart-outline'} size={12} color={Colors.black} />
              <Text style={{ marginLeft: 5, fontSize: 12 }}>
                {isFav ? 'Remove from Favorites' : 'Add to Favorite'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.footer}>
        {isBlocked && (
          <Button
            mode="contained"
            onPress={setBlocked}
            style={styles.button}
            color={Colors.white}
            labelStyle={{ color: Colors.black }}
          >
            Unblock User
          </Button>
        )}
        {isBlocked || (
          <>
            <Button
              mode="contained"
              onPress={
                friend ? removeFriend : reqRcvd ? approveReq : reqSent ? cancelReq : addFriend
              }
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
            <Button
              mode="contained"
              onPress={userData && shareUrl}
              style={styles.button}
              color={Colors.white}
              textColor={Colors.black}
            >
              Share Profile
            </Button>
          </>
        )}
      </View>
      {showReport && (
        <View style={styles.report}>
          <Text style={styles.reportText}>
            Your report has been submitted and we will check the user status manually.
          </Text>
        </View>
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingVertical: 16,
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
  report: {
    backgroundColor: Colors.black,
    padding: 16,
    borderRadius: 12,
  },
  reportText: {
    color: Colors.white,
    fontSize: 16,
  },
});
