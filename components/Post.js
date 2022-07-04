import React from 'react';
import { StyleSheet, Image, Dimensions, View } from 'react-native';

import { Text } from './Text';
import { Colors } from '../config';
import { Icon } from './Icon';

export const Post = ({ user, post }) => {
  return (
    <View style={styles.container}>
      <View style={styles.userDetails}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={{ paddingHorizontal: 10, flex: 1 }}>
          <Text bold={true}>{user.name}</Text>
          <Text>{user.bio}</Text>
        </View>
      </View>
      <View style={styles.postDetails}>
        <View style={styles.imgContainer}>
          <View style={styles.image}>
            <Image source={{ uri: post.url }} style={styles.postImg} />
          </View>
        </View>
        <View style={styles.postInfo}>
          <View style={styles.likes}>
            <Icon name="heart" size={20} color={Colors.trueBlack} />
            <Text style={{ paddingLeft: 10 }}>{post.likes} Likes</Text>
          </View>
          <View style={styles.comments}>
            <Icon name="comment-multiple" size={20} color={Colors.trueBlack} />
            <Text style={{ paddingLeft: 10 }}>{post.comments} Comments</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 65 / 2,
  },
  userDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postDetails: {
    flex: 1,
  },
  imgContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.trueBlack,
    width: '100%',
    paddingBottom: '100%',
    height: null,
    borderRadius: 15,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
  },
  postImg: {
    width: '100%',
    height: 'auto',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  postInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'space-between',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 30,
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comments: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
