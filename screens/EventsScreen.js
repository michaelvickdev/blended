import React, { useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Dimensions, Linking } from 'react-native';
import { View } from '../components';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../config';
import { Text } from '../components/Text';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config';

export const EventsScreen = () => {
  const mountedRef = useRef(true);

  const [events, setEvents] = React.useState([]);

  const getEvents = async () => {
    try {
      const eventsQuery = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsQuery);
      const eventsData = eventsSnapshot.docs.map((doc) => doc.data());
      if (mountedRef.current) {
        setEvents(eventsData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getEvents();
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        automaticallyAdjustsScrollIndicatorInsets={false}
        scrollIndicatorInsets={{ right: Number.MIN_VALUE }}
      >
        {events.length > 0 &&
          events.map((event, index) => (
            <SingleEvent
              key={index}
              title={event.title}
              url={event.url}
              uploadDate={event.uploaded}
            />
          ))}
      </ScrollView>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.mainFirst, Colors.mainSecond]}
      ></LinearGradient>
    </View>
  );
};

const SingleEvent = ({ title, url, uploadDate }) => (
  <View style={styles.event}>
    <Text bold={true} heading={true} style={{ fontSize: 16 }}>
      {title}
    </Text>
    <Text style={{ color: Colors.link, fontSize: 16 }} onPress={() => Linking.openURL(url)}>
      {url}
    </Text>
    <Text style={{ textAlign: 'right', color: Colors.mediumGray, marginTop: 8 }}>
      Uploaded {new Date(uploadDate.toDate()).toLocaleDateString()}
    </Text>
  </View>
);

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
  event: {
    padding: 16,
    borderColor: Colors.lightGray,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    marginBottom: 16,
  },
});
