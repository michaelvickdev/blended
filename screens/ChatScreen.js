import React, { useState, useContext } from 'react';
import { Icon, View } from '../components';
import { Text } from '../components/Text';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, TextInput } from 'react-native-paper';
import Constants from 'expo-constants';

import { collection, doc, getDoc, arrayUnion, addDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../config';
import { AuthenticatedUserContext } from '../providers';

export const ChatScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [text, setText] = useState('');
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
      await addDoc(msgRef, {
        text: text,
        timestamp: Date.now(),
        sentBy: user.uid,
      });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    setText('');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <ChatHeader name="vick" navigation={navigation} />
        <ScrollView style={{ background: 'transparent' }}>
          <ChatBubble />
          <ChatBubble self={true} />
        </ScrollView>
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
          />
          <Button
            mode="contained"
            color={isLoading ? Colors.lightGray : Colors.white}
            onPress={sendText}
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

const ChatBubble = ({ self }) => {
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
        <Text style={{ fontSize: 16 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore.
        </Text>
      </View>
      <View style={styles.chatBubbleTime}>
        <Text style={{ fontSize: 12, color: Colors.mediumGray, marginRight: 2 }}>12:00</Text>
        <Icon name="check" size={14} color={Colors.mediumGray} />
      </View>
    </View>
  );
};

export const ChatHeader = ({ name, navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.back}>
        <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
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
        <View style={styles.action}>
          <TouchableOpacity style={styles.item}>
            <MaterialIcons name="person" size={12} color={Colors.black} />
            <Text heading={true} style={{ marginLeft: 5, fontSize: 12 }}>
              Block User
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.item}>
            <MaterialIcons name="person" size={12} color={Colors.black} />
            <Text heading={true} style={{ marginLeft: 5, fontSize: 12 }}>
              Report User
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: Constants.statusBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('window').width,
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
    left: 0,
  },
  divider: {
    width: '10%',
  },
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.lightGray,
  },
});
