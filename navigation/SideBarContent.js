import React, { useContext, useEffect, useState, useRef } from 'react';
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
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../config';
import AwesomeAlert from 'react-native-awesome-alerts';

export function SideBarContent(props) {
  const { user, changeCounter, setPaymentCounter } = useContext(AuthenticatedUserContext);
  const [imgUrl, setImgUrl] = useState(require('../assets/default-image.png'));
  const [userDetails, setUserDetails] = useState(null);
  const [cancelAlert, setCancelAlert] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const mountedRef = useRef(true);

  const signOutHandler = () => {
    setTimeout(async () => {
      await signOut(auth);
    }, 0);
  };

  const cancelSub = async () => {
    try {
      const response = await fetch(Constants.manifest.extra.delSub, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: userDetails.plan.id,
        }),
      });
      const responseJson = await response.json();
      const { status } = responseJson;
      if (status === 'canceled') {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, {
          plan: deleteField(),
          isMember: false,
        });
        if (mountedRef.current) setShowConfirm(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    (async () => {
      mountedRef.current = true;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        if (mountedRef.current) setUserDetails({ ...docSnap.data() });
        const image = await getImage(docSnap.data().avatar);
        if (image && mountedRef.current) {
          setImgUrl(image);
        }
      }
    })();
  }, [changeCounter, user]);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );

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
                    {userDetails ? userDetails?.plan?.description + ' Plan' : ''}
                  </Text>
                  <Button
                    color={Colors.white}
                    textColor={Colors.black}
                    mode="contained"
                    uppercase={false}
                    compact
                    style={{ marginTop: 10, alignSelf: 'center', borderRadius: 10 }}
                    labelStyle={{ marginVertical: 5, marginHorizontal: 6 }}
                    onPress={() => setCancelAlert(true)}
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
          onPress={() => setShowSignOut(true)}
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
      <AwesomeAlert
        show={cancelAlert}
        showProgress={false}
        title="Confirm"
        message="Are you sure you want to cancel your subscription?"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText="Yes"
        cancelText="No"
        cancelButtonColor={Colors.red}
        confirmButtonColor={Colors.secondary}
        onCancelPressed={() => {
          setCancelAlert(false);
        }}
        onConfirmPressed={() => {
          cancelSub();
          setCancelAlert(false);
        }}
      />
      <AwesomeAlert
        show={showConfirm}
        showProgress={false}
        title="Unsubscribed"
        message="You have successfully unsubscribed from the plan."
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="Ok"
        confirmButtonColor={Colors.secondary}
        animatedValue={0}
        onConfirmPressed={() => {
          setShowConfirm(false);
          setPaymentCounter((prev) => prev + 1);
        }}
      />
      <AwesomeAlert
        show={showSignOut}
        showProgress={false}
        title="Sign Out"
        message="Do you want to sign out?"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No"
        confirmText="Yes"
        confirmButtonColor={Colors.red}
        cancelButtonColor={Colors.secondary}
        animatedValue={0}
        onCancelPressed={() => {
          setShowSignOut(false);
        }}
        onConfirmPressed={() => {
          setShowSignOut(false);
          signOutHandler();
        }}
      />
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
