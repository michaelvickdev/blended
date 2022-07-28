import React, { useEffect, useState, useRef, useContext } from 'react';
import { StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config';
const { AuthenticatedUserContext } = require('../providers');

import { Text } from './Text';
import { Colors } from '../config';
import { Icon } from './Icon';
import { getImage } from '../hooks/getImage';

export const Post = ({ post, navigation }) => {
  const { changeCounter, user } = useContext(AuthenticatedUserContext);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentCount, setCommentCount] = useState(post.comments.length);
  const [userInfo, setUserInfo] = useState(null);
  const [postImage, setPostImage] = useState(require('../assets/default-post.jpg'));
  const [profileImage, setprofileImage] = useState(require('../assets/default-image.png'));
  const mountedRef = useRef(true);

  const goToProfile = () => {
    if (post.uid == user.uid) {
      navigation.navigate('ProfileStack');
    } else {
      navigation.navigate('UserProfile', { uid: post.uid });
    }
  };

  const goToComments = () => {
    navigation.navigate('Comments', { postId: post.feedId });
  };

  const getUser = async () => {
    const docRef = doc(db, 'users', post.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && mountedRef.current) {
      setUserInfo({ ...docSnap.data() });
      const image = await getImage(docSnap.data().avatar);
      if (image && mountedRef.current) {
        setprofileImage(image);
      }
    } else {
      console.log('Here, no such document!');
    }
  };

  const getLikeInfo = async () => {
    if (!userInfo) return;
    if (mountedRef.current && post.likes.length && post.likes.includes(userInfo.uid)) {
      setIsLiked(true);
    }
    const feedRef = doc(db, 'feeds', post.feedId);
    const feedSnap = await getDoc(feedRef);
    if (feedSnap.exists() && mountedRef.current) {
      setLikeCount(feedSnap.data().likes.length);
    }
  };

  const getCommentInfo = async () => {
    if (!userInfo) return;
    const feedRef = doc(db, 'feeds', post.feedId);
    const feedSnap = await getDoc(feedRef);
    if (feedSnap.exists() && mountedRef.current) {
      setCommentCount(feedSnap.data().comments.length);
    }
  };

  const setLike = async () => {
    const feedRef = doc(db, 'feeds', post.feedId);
    const updateObj = isLiked
      ? { likes: arrayRemove(userInfo.uid) }
      : { likes: arrayUnion(userInfo.uid) };
    if (mountedRef.current) {
      setLikeCount((prev) => (isLiked ? (prev != 0 ? prev - 1 : prev) : prev + 1));
      setIsLiked((prev) => !prev);
    }
    await updateDoc(feedRef, updateObj);
  };

  const setImage = async () => {
    const image = await getImage(post.url);
    if (image && mountedRef.current) {
      setPostImage(image);
    }
  };

  useEffect(() => {
    getUser();
    setImage();
  }, []);

  useEffect(() => {
    getLikeInfo();
  }, [userInfo]);

  useEffect(() => {
    getCommentInfo();
  }, [changeCounter]);

  useEffect(() => () => (mountedRef.current = false), []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.userDetails} onPress={goToProfile}>
        <Image source={profileImage} style={styles.avatar} />
        <View style={{ paddingHorizontal: 10, flex: 1 }}>
          <Text bold={true} heading={true}>
            {userInfo?.username}
          </Text>
          <Text>{userInfo?.about}</Text>
        </View>
      </TouchableOpacity>
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
          <TouchableOpacity onPress={setLike}>
            <View style={styles.likes}>
              <Icon name={isLiked ? 'heart' : 'heart-outline'} size={20} color={Colors.trueBlack} />
              <Text style={{ paddingLeft: 7 }}>
                {likeCount} {likeCount == 1 ? 'Like' : 'Likes'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToComments}>
            <View style={styles.comments}>
              <Icon name="comment-multiple" size={20} color={Colors.trueBlack} />
              <Text style={{ paddingLeft: 7 }}>
                {commentCount} {commentCount == 1 ? 'Comment' : 'Comments'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.report}>
              <Icon name="alert-circle" size={20} color={Colors.trueBlack} />
              <Text style={{ paddingLeft: 7 }}>Report Abuse</Text>
            </View>
          </TouchableOpacity>
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
