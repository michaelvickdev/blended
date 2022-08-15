import React, { useState, useEffect, useContext, useRef } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Post } from './Post';
import { View } from './View';
import { Text } from './Text';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
  arrayUnion,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../config/';

export const Posts = ({ navigation }) => {
  const { user, feedReload } = useContext(AuthenticatedUserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportCount, setReportCount] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [lastDoc, setLastDoc] = useState('start');
  const mountedRef = useRef(true);

  const getPosts = async (count = 3) => {
    if (lastDoc === 'end') return;
    setLoading(true);
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    const reqProfiles = [user.uid];
    if (userSnap.exists()) {
      if (userSnap.data().friends.length) {
        reqProfiles.push(...userSnap.data().friends);
      }
    }
    const docRef = collection(db, 'feeds');

    const queryArray = [
      where('uid', 'in', reqProfiles),
      orderBy('uploadDate', 'desc'),
      limit(count),
    ];

    if (lastDoc !== 'start') {
      queryArray.push(startAfter(lastDoc));
    }

    const q = query(docRef, ...queryArray);

    const docSnap = await getDocs(q);
    const feedData = docSnap.docs.map((doc) => ({
      ...doc.data(),
      feedId: doc.id,
    }));
    if (mountedRef.current) {
      docSnap.size < count ? setLastDoc('end') : setLastDoc(docSnap.docs[docSnap.docs.length - 1]);
      setPosts((prevPosts) => [...prevPosts, ...feedData]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportCount > 0) {
      setShowReport(true);
      const timeout = setTimeout(() => {
        setShowReport(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [reportCount]);

  useEffect(() => {
    mountedRef.current = true;
    setReportCount(0);
    setLastDoc('start');
    setLoading(true);
    setShowReport(false);
    setPosts([]);
    getPosts();
  }, [feedReload]);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const reportPost = async (feedId) => {
    const docRef = doc(db, 'feeds', feedId);
    await updateDoc(docRef, {
      reported: arrayUnion(user.uid),
    });
    if (mountedRef.current) {
      setPosts((prev) =>
        prev.map((post) =>
          post.feedId === feedId ? Object.assign([], { ...post, hidden: true }) : post
        )
      );
      setReportCount((prev) => prev + 1);
    }
    console.log('reported');
  };

  if (!posts.length) {
    return (
      <LinearGradient style={styles.container} colors={[Colors.mainFirst, Colors.mainSecond]}>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>
          {loading ? 'Loading...' : 'No feeds to show'}
        </Text>
      </LinearGradient>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        automaticallyAdjustsScrollIndicatorInsets={false}
        scrollIndicatorInsets={{ right: Number.MIN_VALUE }}
        onScroll={({ nativeEvent }) => {
          if (!loading && isCloseToBottom(nativeEvent)) getPosts();
        }}
        scrollEventThrottle={400}
      >
        {posts.map((post) =>
          post?.hidden || post?.reported.includes(user.uid) ? null : (
            <Post
              key={post.feedId}
              user={post.uid}
              post={post}
              navigation={navigation}
              reportPost={reportPost}
            />
          )
        )}
        {lastDoc !== 'end' && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.secondary} />
          </View>
        )}
      </ScrollView>
      {showReport && (
        <View style={styles.report}>
          <Text style={styles.reportText}>
            Your report has been submitted and we have removed the post from you Feeds. We will
            check the post manually.
          </Text>
        </View>
      )}
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.mainFirst, Colors.mainSecond]}
      ></LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  report: {
    backgroundColor: Colors.black,
    padding: 16,
  },
  reportText: {
    color: Colors.white,
    fontSize: 16,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
});
