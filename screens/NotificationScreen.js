import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../components';
import { Colors } from '../config';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/';
import { View } from '../components';

export const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthenticatedUserContext);

  const getNotifications = async () => {
    const docRef = doc(db, 'users', user.uid);
    const data = await getDoc(docRef);
    if (data.data()?.notifications.length) {
      setNotifications(data.data().notifications.reverse());
    }
    setLoading(false);
  };
  useEffect(() => {
    getNotifications();
  }, []);

  if (!notifications.length) {
    return (
      <LinearGradient
        style={{ flex: 1, padding: 16 }}
        colors={[Colors.mainFirst, Colors.mainSecond]}
      >
        <Text style={styles.text}>
          {loading ? 'Loading...' : 'There is nothing here at the moment'}
        </Text>
      </LinearGradient>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        automaticallyAdjustsScrollIndicatorInsets={false}
        scrollIndicatorInsets={{ right: Number.MIN_VALUE }}
      >
        {notifications.map((notification, index) => (
          <View key={index} style={styles.notification}>
            <Text style={{ fontSize: 16 }}>{notification}</Text>
          </View>
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
  text: {
    textAlign: 'center',
  },

  container: {
    background: 'transparent',
    paddingHorizontal: 16,
  },

  gradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: -1,
  },

  notification: {
    padding: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    marginBottom: 8,
  },
});
