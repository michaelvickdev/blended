import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { fakeData } from '../assets/fakeData';
import { Post } from './Post';
import { View } from './View';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';

import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/';

export const Posts = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const docRef = collection(db, 'feeds', user.uid, 'userFeeds');
    const q = query(docRef, orderBy('uploadDate', 'desc'));
    const docSnap = await getDocs(q);

    const feedData = docSnap.docs.map((doc) => doc.data());
    setPosts(feedData);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {posts.map((post, index) => (
          <Post key={index} user={user} post={post} />
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
