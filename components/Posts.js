import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { fakeData } from '../assets/fakeData';
import { Post } from './Post';
import { View } from './View';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';

export const Posts = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    setPosts(fakeData);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        styles={styles.container}
        contentContainerStyle={{ backgroundColor: Colors.white, padding: 16 }}
      >
        {posts.map((post) => (
          <Post key={post.post.id} user={post.user} post={post.post} />
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
    backgroundColor: 'transparent',
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
