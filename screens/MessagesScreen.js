import React, { useEffect, useContext, useState, useRef } from 'react';
import { View } from '../components';
import { StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../components/Text';

import { createStackNavigator } from '@react-navigation/stack';
import { ChatScreen } from './ChatScreen';

import { getDoc, doc, query, orderBy, limit, collection, getDocs } from 'firebase/firestore';
import { getImage } from '../hooks/getImage';
import { AuthenticatedUserContext } from '../providers';
import { db } from '../config';

const Stack = createStackNavigator();

export const MessagesStack = () => {
  return (
    <Stack.Navigator initialRouteName="Messages">
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Chats"
        component={ChatScreen}
        options={() => ({
          headerStyle: {
            backgroundColor: Colors.mainFirst,
          },
          headerShown: false,
          headerLeft: () => null,
        })}
      />
    </Stack.Navigator>
  );
};

const Messages = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  const getThreads = async () => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    const chats = userSnap.data().chats;
    if (chats && isMounted.current) {
      setThreads(chats);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isMounted.current) {
        setThreads([]);
        setLoading(true);
      }
      getThreads();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => () => (isMounted.current = false), []);

  if (!threads.length) {
    return (
      <LinearGradient style={styles.container} colors={[Colors.mainFirst, Colors.mainSecond]}>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>
          {loading ? 'Loading...' : 'No Messages'}
        </Text>
      </LinearGradient>
    );
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <ScrollView style={styles.container} scrollIndicatorInsets={{ right: 0 }}>
        {threads.map((thread) => (
          <SingleThread key={thread} userId={thread} navigation={navigation} selfId={user.uid} />
        ))}
      </ScrollView>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.mainFirst, Colors.mainSecond]}
      ></LinearGradient>
    </View>
  );
};

const SingleThread = ({ navigation, userId, selfId }) => {
  const [data, setData] = useState(null);
  const [avatar, setAvatar] = useState(require('../assets/default-image.png'));
  const [msgData, setMsgData] = useState(null);
  const navigate = () => {
    navigation.navigate('Chats', { uid: userId });
  };

  useEffect(() => {
    if (data) {
      (async () => {
        const image = await getImage(data.avatar);
        if (image) {
          setAvatar(image);
        }
      })();
    }
  }, [data]);

  const getData = async () => {
    try {
      const userRef = doc(db, 'users', userId);

      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setData({
          avatar: userSnap.data().avatar,
          name: userSnap.data().username,
        });
      }
    } catch (err) {
      console.log('In getting data', err);
    }
  };

  const getLastMsg = async () => {
    try {
      const msgId = selfId > userId ? `${selfId}-${userId}` : `${userId}-${selfId}`;
      const msgRef = collection(db, 'messages', msgId, 'thread');
      const q = query(msgRef, orderBy('timestamp', 'desc'), limit(1));
      const chatSnap = await getDocs(q);
      const chatData = chatSnap.docs.map((doc) => doc.data());
      setMsgData(chatData[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data) {
      getLastMsg();
    }
  }, [data]);

  if (!data || !msgData) {
    return (
      <View style={styles.threadContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.threadContainer} onPress={navigate}>
      <Image source={avatar} style={{ width: 65, height: 65, borderRadius: 65 / 2 }} />
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-between',
          marginLeft: 16,
          alignItems: 'center',
        }}
      >
        <View>
          <Text heading={true} style={{ fontSize: 18 }}>
            {data.name}
          </Text>
          <Text numberOfLines={1} heading={true} style={{ fontSize: 12, width: 100 }}>
            {msgData?.text}
          </Text>
        </View>
        <Text>{new Date(msgData.timestamp).toLocaleTimeString()}</Text>
      </View>
    </TouchableOpacity>
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
  threadContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
  },
});
