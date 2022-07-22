import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config';

import { Text } from './Text';
import { Colors } from '../config';
import { Icon } from './Icon';
import { getImage } from '../hooks/getImage';

export const Post = ({ post }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [postImage, setPostImage] = useState(require('../assets/default-post.jpg'));
  const [profileImage, setprofileImage] = useState(require('../assets/default-image.png'));

  useEffect(() => {
    (async () => {
      const docRef = doc(db, 'users', post.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserInfo({ ...docSnap.data() });
        const image = await getImage(docSnap.data().avatar);
        if (image) {
          setprofileImage(image);
        }
      } else {
        console.log('No such document!');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const image = await getImage(post.url);
      if (image) {
        setPostImage(image);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userDetails}>
        <Image source={profileImage} style={styles.avatar} />
        <View style={{ paddingHorizontal: 10, flex: 1 }}>
          <Text bold={true} heading={true}>
            {userInfo?.username}
          </Text>
          <Text>{userInfo?.about}</Text>
        </View>
      </View>
      {post.title && (
        <Text heading={true} style={{ marginBottom: 4, paddingHorizontal: 8 }}>
          {post.title}
        </Text>
      )}
      <View style={styles.postDetails}>
        <View style={styles.imgContainer}>
          <View style={styles.image}>
            <Image source={postImage} style={styles.postImg} />
          </View>
        </View>
        <View style={styles.postInfo}>
          <View style={styles.likes}>
            <Icon name="heart" size={20} color={Colors.trueBlack} />
            <Text style={{ paddingLeft: 7 }}>{post.likes} Likes</Text>
          </View>
          <View style={styles.comments}>
            <Icon name="comment-multiple" size={20} color={Colors.trueBlack} />
            <Text style={{ paddingLeft: 7 }}>{post.comments} Comments</Text>
          </View>
          <View style={styles.report}>
            <Icon name="alert-circle" size={20} color={Colors.trueBlack} />
            <Text style={{ paddingLeft: 7 }}>Report Abuse</Text>
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
    overflow: 'hidden',
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
    paddingHorizontal: 5,
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comments: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  report: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
