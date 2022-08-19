import React, { useEffect, useContext } from 'react';
import { Posts } from '../components/Posts';
import { AuthenticatedUserContext } from '../providers';
import * as Location from 'expo-location';
import { UserProfile } from '../screens/UserProfile';
import { createStackNavigator } from '@react-navigation/stack';
import { Comments } from './CommentScreen';
import * as Linking from 'expo-linking';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config';

export const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const Stack = createStackNavigator();

  const getCurrentLoc = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      coord: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  };

  useEffect(() => {
    (async () => {
      const initialRoute = await Linking.getInitialURL();
      if (initialRoute) {
        const { path, queryParams } = Linking.parse(initialRoute);
        if (path === 'UserProfile' && !!queryParams.uid) {
          navigation.navigate('UserProfile', { uid: queryParams.uid });
        }
      }
    })();

    Linking.addEventListener('url', (event) => {
      const { path, queryParams } = Linking.parse(event.url);
      if (path === 'UserProfile' && !!queryParams.uid) {
        navigation.navigate('UserProfile', { uid: queryParams.uid });
      }
    });
  }, []);

  useEffect(() => {
    getCurrentLoc();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="Feeds"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Feeds" component={Posts} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="Comments" component={Comments} />
    </Stack.Navigator>
  );
};
