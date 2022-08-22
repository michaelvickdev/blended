import React, { useState, useContext, useEffect } from 'react';
import { useIsMount } from '../hooks/useIsMount';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';

import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { AuthenticatedUserContext } from '../providers';
import { LoadingIndicator } from '../components';
import { auth } from '../config';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { PaymentScreen } from '../screens/PaymentScreen';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config';
import { AddDetailsScreen } from '../screens/AddDetailsScreen';
const customFonts = {
  poppinsLight: require('../assets/fonts/Poppins-Light.ttf'),
  poppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
  futura: require('../assets/fonts/Futura.ttf'),
  futuraBold: require('../assets/fonts/Futura-Bold.ttf'),
};

const TRIAL_PERIOD = 10;

export const RootNavigator = () => {
  const { user, setUser, unsubscribe, paymentCounter, signUpCounter } =
    useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [fontLoaded] = useFonts(customFonts);
  const [addDetails, setAddDetails] = useState(false);
  const isMount = useIsMount();

  const getMemberInfo = async () => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      setAddDetails(true);
      setIsLoading(false);
      return;
    }
    const diff = await updateTrial();
    if (
      ('isMember' in userDoc.data() && userDoc.data().isMember) ||
      ('trial' in userDoc.data() && diff <= TRIAL_PERIOD)
    ) {
      setIsMember(true);
    }
  };

  const updateTrial = async () => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    if ('trial' in userDoc.data()) {
      const dateCreated = userDoc.data().dateCreated.toDate();
      const date = new Date();
      const diff = parseInt((date - dateCreated) / (1000 * 60 * 60 * 24), 10);
      return diff;
    }
    return TRIAL_PERIOD + 1;
  };

  const updateStatus = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setAddDetails(false);
    setIsMember(false);

    await getMemberInfo();
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isMount) updateStatus();
  }, [paymentCounter]);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(auth, async (authenticatedUser) => {
      authenticatedUser ? setUser(authenticatedUser) : setUser(null);
      await updateStatus();
    });
    unsubscribe.current = unsubscribeAuthStateChanged;
    // unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, [user, signUpCounter]);

  if (!fontLoaded || isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {user ? (
        isMember ? (
          <AppStack />
        ) : addDetails ? (
          <AddDetailsScreen showDetails={setAddDetails} />
        ) : (
          <PaymentScreen setMember={setIsMember} isSafe={true} />
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
