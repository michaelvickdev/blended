import React, { useState, useEffect, useContext, useRef } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Post } from './Post';
import { View } from './View';
import { Text } from './Text';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import NetInfo from '@react-native-community/netinfo';

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

const POST_PER_PAGE = 10;

export const Posts = ({ navigation }) => {
  const { user, feedReload } = useContext(AuthenticatedUserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportCount, setReportCount] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const lastDoc = useRef('start');
  const mountedRef = useRef(true);

  const getPosts = async (count = POST_PER_PAGE) => {
    if (lastDoc.current === 'end') return;

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

    if (lastDoc.current !== 'start') {
      queryArray.push(startAfter(lastDoc.current));
    }

    const q = query(docRef, ...queryArray);

    const docSnap = await getDocs(q);
    const feedData = docSnap.docs.map((doc) => ({
      ...doc.data(),
      feedId: doc.id,
    }));
    if (mountedRef.current) {
      lastDoc.current = docSnap.size < count ? 'end' : docSnap.docs[docSnap.docs.length - 1];
      setPosts((prevPosts) => [...prevPosts, ...feedData]);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    initializeFeeds();
  };

  const initializeFeeds = async () => {
    const state = await NetInfo.fetch();
    if (state.isInternetReachable) {
      try {
        lastDoc.current = 'start';
        setReportCount(0);
        setLoading(true);
        setShowReport(false);
        setPosts([]);
        getPosts();
      } catch (e) {
        console.log(e);
        setLoading(false);
        lastDoc.current = 'end';
      }
    } else {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    if (reportCount > 0) {
      setShowReport(true);
      const timeout = setTimeout(() => {
        setShowReport(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [reportCount]);

  useEffect(() => {
    setIsConnected(true);
    mountedRef.current = true;
    initializeFeeds();
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
          {!isConnected
            ? 'Please check your connection'
            : loading
            ? 'Loading...'
            : 'No feeds to show'}
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
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
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
        {posts.length ? (
          <View style={styles.loading}>
            {lastDoc.current !== 'end' ? (
              <ActivityIndicator size="large" color={Colors.secondary} />
            ) : (
              <View style={styles.loading}>
                <Text>All feeds loaded</Text>
              </View>
            )}
          </View>
        ) : null}
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
