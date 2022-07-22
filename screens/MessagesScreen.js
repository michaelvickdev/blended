import React from 'react';
import { View } from '../components';
import { StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../components/Text';

import { createStackNavigator } from '@react-navigation/stack';
import { ChatScreen, ChatHeader } from './ChatScreen';

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
        options={(props) => ({
          headerStyle: {
            backgroundColor: Colors.mainFirst,
          },
          headerShown: false,
          headerTitle: () => <ChatHeader {...props} name="michaelvick" />,
          headerLeft: () => null,
        })}
      />
    </Stack.Navigator>
  );
};

const Messages = ({ navigation }) => {
  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <ScrollView style={styles.container}>
        <SingleThread
          navigation={navigation}
          avatar="https://randomuser.me/api/portraits/med/men/1.jpg"
          name="michaelvick"
          lastMsg="This was the message"
          date="July, 13 01:55 PM"
        />
      </ScrollView>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.mainFirst, Colors.mainSecond]}
      ></LinearGradient>
    </View>
  );
};

const SingleThread = ({ navigation, lastMsg, date, name, avatar }) => {
  const navigate = () => {
    navigation.navigate('Chats');
  };
  return (
    <TouchableOpacity style={styles.threadContainer} onPress={navigate}>
      <Image source={{ uri: avatar }} style={{ width: 65, height: 65, borderRadius: 65 / 2 }} />
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
            {name}
          </Text>
          <Text numberOfLines={1} heading={true} style={{ fontSize: 12, width: 100 }}>
            {lastMsg}
          </Text>
        </View>
        <Text>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
