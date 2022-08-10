import React, { useState, useContext, useEffect } from 'react';
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

export const RootNavigator = () => {
  const { user, setUser, regCompleted, paymentCounter } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [fontLoaded] = useFonts(customFonts);
  const [addDetails, setAddDetails] = useState(false);

  const getMemberInfo = async () => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      setAddDetails(true);
      setIsLoading(false);
      return;
    }
    if ('isMember' in userDoc.data() && userDoc.data().isMember) {
      setIsMember(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(auth, async (authenticatedUser) => {
      authenticatedUser ? setUser(authenticatedUser) : setUser(null);
      setIsLoading(true);
      setAddDetails(false);
      setIsMember(false);
      if (user) {
        await getMemberInfo();
      } else {
        setIsLoading(false);
      }
    });

    // unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, [user, paymentCounter]);

  if (!fontLoaded || isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {user && regCompleted ? (
        isMember ? (
          <AppStack />
        ) : addDetails ? (
          <AddDetailsScreen showDetails={setAddDetails} />
        ) : (
          <PaymentScreen setMember={setIsMember} />
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
