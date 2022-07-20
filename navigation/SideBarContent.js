import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../components/Text';
import { Icon } from '../components/Icon';
import { auth, Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-paper';

import { getImage } from '../hooks/getImage';
import { Avatar, Drawer } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { signOut } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { AuthenticatedUserContext } from '../providers';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config';

export function SideBarContent(props) {
  const { user } = useContext(AuthenticatedUserContext);
  const [imgUrl, setImgUrl] = useState(require('../assets/default-image.png'));
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    (async () => {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserDetails({ ...docSnap.data() });
        const image = await getImage(docSnap.data().avatar);
        if (image) {
          setImgUrl(image);
        }
      }
    })();
  }, []);
  return (
    <LinearGradient style={{ flex: 1 }} colors={[Colors.themeFirst, Colors.themeSecond]}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              marginTop: 10,
              marginBottom: 20,
              alignItems: 'stretch',
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Avatar.Image source={imgUrl} size={65} />
            </View>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 15 }}>
                <Text bold={true} heading={true} style={{ fontSize: 16, marginRight: 6 }}>
                  {userDetails?.fullname}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <View style={{ justifyContent: 'center' }}>
                  <MaterialIcons name="verified" size={34} color="blue" />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text bold={true} heading={true} style={{ fontSize: 14 }}>
                    Yearly Plan
                  </Text>
                  <Button
                    color={Colors.white}
                    textColor={Colors.black}
                    mode="contained"
                    uppercase={false}
                    compact
                    style={{ marginTop: 10, alignSelf: 'center', borderRadius: 10 }}
                    labelStyle={{ marginVertical: 5, marginHorizontal: 6 }}
                  >
                    Cancel Subscription
                  </Button>
                </View>
              </View>
            </View>
          </View>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={() => <Icon name="logout" color={Colors.darkRed} size={24} />}
          label={() => (
            <Text style={{ color: Colors.darkRed, fontSize: 16, marginLeft: -15 }}>Sign Out</Text>
          )}
          onPress={() => signOut(auth)}
          options={{
            drawerActiveTintColor: Colors.darkRed,
            drawerInactiveTintColor: Colors.darkRed,
          }}
        />
        <View style={{ marginLeft: 20 }}>
          <Text style={{ color: Colors.black, fontFamily: 'futura', fontSize: 14 }}>
            v{Constants.manifest.version}
          </Text>
        </View>
      </Drawer.Section>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
