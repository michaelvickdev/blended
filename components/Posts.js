import React, { useState, useEffect, useContext, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Post } from './Post';
import { View } from './View';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';

import { doc, getDoc, collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../config/';

export const Posts = ({ navigation }) => {
  const { user, feedReload } = useContext(AuthenticatedUserContext);
  const [posts, setPosts] = useState([]);
  const mountedRef = useRef(true);

  const getPosts = async () => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    const reqProfiles = [user.uid];
    if (userSnap.exists()) {
      if (userSnap.data().friends.length) {
        reqProfiles.push(...userSnap.data().friends);
      }
    }
    const docRef = collection(db, 'feeds');
    const q = query(docRef, where('uid', 'in', reqProfiles), orderBy('uploadDate', 'desc'));

    const docSnap = await getDocs(q);
    const feedData = docSnap.docs.map((doc) => ({
      ...doc.data(),
      feedId: doc.id,
    }));
    if (mountedRef.current) {
      setPosts(feedData);
    }
  };

  useEffect(() => {
    setPosts([]);
    getPosts();
  }, [feedReload]);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {posts.map((post, index) => (
          <Post key={index} user={post.uid} post={post} navigation={navigation} />
        ))}
      </ScrollView>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.mainFirst, Colors.mainSecond]}
      ></LinearGradient>
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
});
