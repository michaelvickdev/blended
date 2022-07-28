import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View } from '../components';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../config';
import { Text } from '../components/Text';
import { Button, TextInput } from 'react-native-paper';

import { doc, arrayUnion, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config';
import { AuthenticatedUserContext } from '../providers';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

export const Comments = ({ route, navigation }) => {
  const mountedRef = useRef(true);
  const scrollViewRef = useRef();
  const { user, setChangeCounter } = useContext(AuthenticatedUserContext);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const feedRef = doc(db, 'feeds', route.params.postId);
        const feedData = await getDoc(feedRef);
        if (mountedRef.current && feedData.data().comments.length)
          setComments(feedData.data().comments);
      } catch (error) {
        console.log(error);
      }
    })();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const addComment = async () => {
    if (!text) return;
    setIsLoading(true);
    try {
      const feedRef = doc(db, 'feeds', route.params.postId);

      const comment = {
        text: text,
        timestamp: Date.now(),
        sentBy: user.uid,
      };
      await updateDoc(feedRef, {
        comments: arrayUnion(comment),
      });
      if (mountedRef.current) {
        setChangeCounter((prev) => prev + 1);
        setComments((prev) => [...prev, comment]);
      }
    } catch (error) {
      console.log(error);
    }
    if (mountedRef.current) {
      setIsLoading(false);
      setText('');
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View isSafe style={{ flex: 1 }}>
        <CommentHeader commentLength={comments.length} navigation={navigation} />
        <ScrollView
          style={styles.container}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          scrollIndicatorInsets={{ right: 0 }}
        >
          {comments.map((comment, index) => (
            <CommentBubble
              key={index}
              text={comment.text}
              timestamp={comment.timestamp}
              user={comment.sentBy == user.uid ? 'self' : comment.sentBy}
            />
          ))}
        </ScrollView>

        <View style={styles.commentBox}>
          <TextInput
            style={{ flex: 1, marginRight: 16 }}
            mode="outlined"
            placeholder="Type Your Comment here..."
            outlineColor={Colors.lightGray}
            activeOutlineColor={Colors.mediumGray}
            multiline={true}
            value={text}
            onChangeText={(text) => setText(text)}
          />
          <Button
            mode="contained"
            color={isLoading ? Colors.lightGray : Colors.white}
            onPress={addComment}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </View>
      </View>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.mainFirst, Colors.mainSecond]}
      ></LinearGradient>
    </View>
  );
};

const CommentBubble = ({ text, timestamp, user }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    let mounted = true;
    if (user === 'self') {
      setUsername('You');
    } else {
      (async () => {
        const userRef = doc(db, 'users', user);
        const userData = await getDoc(userRef);
        if (mounted) {
          setUsername(userData.data().username);
        }
      })();
    }
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <View style={[styles.commentBubble]}>
      <View style={styles.commentBubbleText}>
        <Text style={{ fontSize: 16, marginBottom: 5 }} heading={true} bold={true}>
          {username}
        </Text>
        <Text style={{ fontSize: 16 }}>{text}</Text>
      </View>
      <View style={styles.commentBubbleTime}>
        <Text style={{ fontSize: 12, color: Colors.mediumGray, marginRight: 2 }}>
          {new Date(timestamp).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
};

const CommentHeader = ({ commentLength, navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text
          heading={true}
          bold={true}
          style={{ fontSize: 16, alignSelf: 'stretch', textAlign: 'center' }}
        >
          {commentLength == 0 ? 'No' : commentLength} {commentLength > 1 ? 'Comments' : 'Comment'}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    background: 'transparent',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: '100%',
    zIndex: -1,
  },
  commentBubble: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.lightGray,
  },
  commentBubbleText: {
    flex: 1,
  },
  commentBubbleTime: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  commentBox: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.lightGray,
  },
  headerContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
