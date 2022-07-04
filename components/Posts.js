import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { fakeData } from '../assets/fakeData';
import { Post } from './Post';
import { View } from './View';
import { Colors } from '../config';

export const Posts = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    setPosts(fakeData);
  }, []);
  return (
    <ScrollView
      styles={styles.container}
      contentContainerStyle={{ backgroundColor: Colors.white, padding: 16 }}
    >
      {posts.map((post) => (
        <Post key={post.post.id} user={post.user} post={post.post} />
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
});
