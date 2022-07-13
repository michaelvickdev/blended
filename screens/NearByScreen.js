import MapView, { Marker } from 'react-native-maps';
import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { View } from '../components';
import { fakeData } from '../assets/fakeData';

const CURRENT_USER = 123456;
const markersData = fakeData.map((single) => single.user);
const CURRENT_LOCATION = markersData.filter((single) => single.id == CURRENT_USER)[0].coordinate;

export const NearByScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType="mutedStandard"
        showsUserLocation={true}
        initialRegion={{
          ...CURRENT_LOCATION,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {markersData.map((single, index) => (
          <Marker
            key={index}
            coordinate={single.coordinate}
            title={single.username}
            image={require('../assets/user-location.png')}
          />
        ))}
      </MapView>
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
