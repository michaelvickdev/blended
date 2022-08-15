import React, { useState, useContext, useEffect, useRef } from 'react';
import { BackHandler, FlatList } from 'react-native';
import { Icon, View } from '../components';
import { Text } from '../components/Text';
import { Dimensions, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, TextInput } from 'react-native-paper';

import {
  collection,
  doc,
  arrayUnion,
  addDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  getDoc,
  arrayRemove,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../config';
import { AuthenticatedUserContext } from '../providers';

export const ChatScreen = ({ navigation, route }) => {
  const isMounted = useRef(true);
  const { user } = useContext(AuthenticatedUserContext);
  const [chat, setChat] = useState([]);
  const [text, setText] = useState('');
  const [inChat, setInChat] = useState(false);
  const [name, setName] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [hasBlocked, setHasBlocked] = useState(false);
  const [lastMsg, setLastMsg] = useState('start');
  const [loading, setLoading] = useState(true);

  const getName = async () => {
    try {
      const userRef = doc(db, 'users', route.params.uid);
      const usernameSnap = await getDoc(userRef);
      if (isMounted.current) setName(usernameSnap.data().username);
    } catch (err) {
      console.log('error here', err);
    }
  };

  const getChat = async (count = 8) => {
    if (lastMsg === 'end') return;
    try {
      setLoading(true);
      const msgId =
        user.uid > route.params.uid
          ? `${user.uid}-${route.params.uid}`
          : `${route.params.uid}-${user.uid}`;
      const msgRef = collection(db, 'messages', msgId, 'thread');
      const queryArray = [orderBy('timestamp', 'desc'), limit(count)];
      if (lastMsg !== 'start') {
        queryArray.push(startAfter(lastMsg));
      }
      const q = query(msgRef, ...queryArray);
      const chatSnap = await getDocs(q);
      const chatData = chatSnap.docs.map((doc) => doc.data());
      if (isMounted.current) {
        setChat((prevChat) => [...prevChat, ...chatData]);
        chatSnap.size < count
          ? setLastMsg('end')
          : setLastMsg(chatSnap.docs[chatSnap.docs.length - 1]);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkBlocked = async () => {
    const userRef = doc(db, 'users', route.params.uid);
    const userDoc = await getDoc(userRef);
    if (
      isMounted.current &&
      userDoc.data().blockList?.length &&
      userDoc.data().blockList?.includes(user.uid)
    ) {
      setHasBlocked(true);
      return;
    }

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (
      isMounted.current &&
      docSnap.data().blockList?.length &&
      docSnap.data().blockList?.includes(route.params.uid)
    ) {
      setIsBlocked(true);
    }
  };

  const setBlock = async () => {
    const docRef = doc(db, 'users', user.uid);
    const updateObj = isBlocked
      ? { blockList: arrayRemove(route.params.uid) }
      : {
          blockList: arrayUnion(route.params.uid),
          favourites: arrayRemove(route.params.uid),
          friends: arrayRemove(route.params.uid),
          requests: arrayRemove(route.params.uid),
        };
    await updateDoc(docRef, updateObj);
    if (!isBlocked) {
      updateDoc(doc(db, 'users', route.params.uid), {
        friends: arrayRemove(user.uid),
        favourites: arrayRemove(user.uid),
        requests: arrayRemove(user.uid),
      });
    }
    setIsBlocked((prev) => !prev);
  };

  useEffect(() => {
    isMounted.current = true;
    setChat([]);
    setLastMsg('start');
    (async () => {
      await checkBlocked();
      await getChat();
      await getName();
    })();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const sendText = async () => {
    if (!text) return;
    setIsLoading(true);
    try {
      const msgId =
        user.uid > route.params.uid
          ? `${user.uid}-${route.params.uid}`
          : `${route.params.uid}-${user.uid}`;
      const msgRef = collection(db, 'messages', msgId, 'thread');

      const msg = {
        text: text,
        timestamp: Date.now(),
        sentBy: user.uid,
      };
      await addDoc(msgRef, msg);

      const userRef = doc(db, 'users', user.uid);
      const friendRef = doc(db, 'users', route.params.uid);
      if (!inChat) {
        await updateDoc(friendRef, {
          chats: arrayUnion(userRef.id),
        });

        await updateDoc(userRef, {
          chats: arrayUnion(friendRef.id),
        });
        if (isMounted.current) setInChat(true);
      }
      setChat((prev) => [msg, ...prev]);
    } catch (error) {
      console.log(error);
    }
    if (isMounted.current) {
      setIsLoading(false);
      setText('');
    }
  };

  function handleBackButtonClick() {
    navigation.navigate('MessagesStack');
  }

  function goBack() {
    navigation.popToTop(null);
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View isSafe style={styles.container}>
        <ChatHeader
          name={name}
          goBack={goBack}
          isBlocked={isBlocked}
          setBlock={setBlock}
          hasBlocked={hasBlocked}
        />
        <View style={styles.chatContainer}>
          {chat.length ? (
            <FlatList
              data={chat}
              style={{ background: 'transparent', paddingHorizontal: 16 }}
              renderItem={({ item }) => (
                <ChatBubble
                  self={item.sentBy === user.uid}
                  text={item.text}
                  timestamp={item.timestamp}
                />
              )}
              inverted
              ListFooterComponent={() =>
                lastMsg !== 'end' ? (
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" color={Colors.secondary} />
                  </View>
                ) : null
              }
              onEndReached={() => {
                if (!loading) getChat();
              }}
              onEndReachedThreshold={0.1}
            />
          ) : null}

          <View style={styles.chatBox}>
            <TextInput
              style={{ flex: 1, marginRight: 16 }}
              mode="outlined"
              placeholder="Type Your Message here..."
              outlineColor={Colors.lightGray}
              activeOutlineColor={Colors.mediumGray}
              multiline={true}
              value={text}
              onChangeText={(text) => setText(text)}
              disabled={isLoading || hasBlocked || isBlocked}
            />
            <Button
              mode="contained"
              color={isLoading || isBlocked ? Colors.lightGray : Colors.white}
              onPress={sendText}
              disabled={isLoading || hasBlocked || isBlocked}
            >
              {isBlocked || hasBlocked ? 'Blocked' : isLoading ? 'Sending...' : 'Send'}
            </Button>
          </View>
        </View>
      </View>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.mainFirst, Colors.mainSecond]}
      ></LinearGradient>
    </View>
  );
};

const ChatBubble = ({ self, text, timestamp }) => {
  return (
    <View
      style={[
        styles.chatBubble,
        {
          backgroundColor: self ? Colors.lightGray : Colors.white,
          alignSelf: self ? 'flex-end' : 'flex-start',
        },
      ]}
    >
      <View style={styles.chatBubbleText}>
        <Text style={{ fontSize: 16 }}>{text}</Text>
      </View>
      <View style={styles.chatBubbleTime}>
        <Text style={{ fontSize: 12, color: Colors.mediumGray, marginRight: 2 }}>
          {new Date(timestamp).toLocaleTimeString()}
        </Text>
        <Icon name="check" size={14} color={Colors.mediumGray} />
      </View>
    </View>
  );
};

export const ChatHeader = ({ name, goBack, isBlocked, setBlock, hasBlocked }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.back}>
        <TouchableOpacity onPress={goBack} style={{ flex: 1, marginLeft: 16 }}>
          <Icon name="keyboard-backspace" size={32} />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text
          heading={true}
          bold={true}
          style={{ fontSize: 16, alignSelf: 'stretch', textAlign: 'center' }}
        >
          {name}
        </Text>
        {!hasBlocked && (
          <View style={styles.action}>
            {isBlocked && (
              <TouchableOpacity style={styles.item} onPress={setBlock}>
                <MaterialIcons name="person" size={12} color={Colors.black} />
                <Text heading={true} style={{ marginLeft: 5, fontSize: 12, lineHeight: 14 }}>
                  Unblock User
                </Text>
              </TouchableOpacity>
            )}
            {!isBlocked && (
              <>
                <TouchableOpacity style={styles.item} onPress={setBlock}>
                  <MaterialIcons name="person" size={12} color={Colors.black} />
                  <Text heading={true} style={{ marginLeft: 5, fontSize: 12, lineHeight: 14 }}>
                    Block User
                  </Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.item}>
                  <MaterialIcons name="person" size={12} color={Colors.black} />
                  <Text heading={true} style={{ marginLeft: 5, fontSize: 12, lineHeight: 14 }}>
                    Report User
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    paddingHorizontal: 16,
  },
  header: {
    flex: 1,
  },
  action: {
    felx: 1,
    flexDirection: 'row',
    marginTop: 6,
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    zIndex: 9,
    left: 0,
  },
  divider: {
    width: '10%',
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
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
  chatBubble: {
    width: '70%',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
  },
  chatBubbleText: {
    flex: 1,
  },
  chatBubbleTime: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  chatBox: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.lightGray,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
});
