import MapView, { Marker } from 'react-native-maps';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { View } from '../components';
import * as Location from 'expo-location';
import { Text } from '../components/Text';
import { AuthenticatedUserContext } from '../providers';

import {
  doc,
  getDoc,
  query,
  where,
  documentId,
  collection,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config';

export const NearByScreen = () => {
  const mountedRef = useRef(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [permissionGiven, setPermissionGiven] = useState(true);

  const { user } = useContext(AuthenticatedUserContext);

  const getCurrentLoc = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setPermissionGiven(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    const userRef = doc(db, 'users', user.uid);
    const userData = await getDoc(userRef);
    const username = userData.data().username;
    await updateDoc(userRef, {
      coord: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
    if (mountedRef.current)
      setMarkers((prev) => [
        ...prev,
        {
          coord: { latitude: location.coords.latitude, longitude: location.coords.longitude },
          uid: user.uid,
          username: username,
        },
      ]);
  };

  const getMarkers = async () => {
    const userRef = doc(db, 'users', user.uid);
    const userData = await getDoc(userRef);
    const friends = userData.data().friends;

    const friendRef = query(collection(db, 'users'), where(documentId(), 'in', friends));

    const friendSnapshot = await getDocs(friendRef);

    const coordData = friendSnapshot.docs.map((single) => ({
      coord: 'coord' in single.data() ? single.data().coord : null,
      uid: single.data().uid,
      username: single.data().username,
    }));
    if (mountedRef.current) setMarkers((prev) => [...prev, ...coordData]);
  };

  useEffect(() => {
    getCurrentLoc();
    getMarkers();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (!permissionGiven) {
    return (
      <View style={styles.container}>
        <Text>Please enable location services</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          style={styles.map}
          mapType="mutedStandard"
          showsUserLocation={true}
          initialRegion={{
            ...currentLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {markers.map(
            (single, index) =>
              single.coord && (
                <Marker
                  key={index}
                  coordinate={single.coord}
                  title={single.username}
                  image={require('../assets/user-loc.png')}
                />
              )
          )}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
