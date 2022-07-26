import React, { useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileHeader } from '../components/ProfileHeader';
import { Colors } from '../config';
import { PostCarouselItem } from '../components/PostCarouselItem';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from '../components/View';
import { SocialIcon } from 'react-native-elements';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config';
import { AuthenticatedUserContext } from '../providers';

export const MyProfileScreen = ({ navigation }) => {
  const mountedRef = useRef(true);
  const { user, changeCounter } = useContext(AuthenticatedUserContext);
  const [userData, setUserData] = useState(null);
  const [feedData, setFeedData] = useState([]);

  const getFeed = async () => {
    const docRef = collection(db, 'feeds');
    const q = query(docRef, where('uid', '==', user.uid), orderBy('uploadDate', 'desc'));
    const docSnap = await getDocs(q);

    const feedRes = docSnap.docs.map((doc) => doc.data());

    if (mountedRef.current) setFeedData(feedRes);
  };

  const getUserData = async () => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && mountedRef.current) {
      setUserData({ ...docSnap.data(), avatar: docSnap.data().avatar });
    } else {
      console.log('No such document!');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUserData();
      getFeed();
    });
    return () => {
      unsubscribe();
      mountedRef.current = false;
    };
  }, [navigation, changeCounter]);

  return (
    <LinearGradient style={styles.container} colors={[Colors.mainFirst, Colors.mainSecond]}>
      {userData && <ProfileHeader user={{ ...userData, uid: '' }} />}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {feedData.map((post, index) => (
            <PostCarouselItem item={post} index={index} key={index} />
          ))}
        </ScrollView>
        {userData && 'socialLinks' in userData && (
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
