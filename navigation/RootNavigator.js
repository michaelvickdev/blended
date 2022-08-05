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

const customFonts = {
  poppinsLight: require('../assets/fonts/Poppins-Light.ttf'),
  poppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
  futura: require('../assets/fonts/Futura.ttf'),
  futuraBold: require('../assets/fonts/Futura-Bold.ttf'),
};

export const RootNavigator = () => {
  const { user, setUser, regCompleted } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [fontLoaded] = useFonts(customFonts);

  const getMemberInfo = async () => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    if ('isMember' in userDoc.data() && userDoc.data().isMember) {
      setIsMember(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(auth, (authenticatedUser) => {
      setIsLoading(true);
      authenticatedUser ? setUser(authenticatedUser) : setUser(null);
      setIsMember(false);
      if (user) {
        getMemberInfo();
      } else {
        setIsLoading(false);
      }
    });

    // unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, [user]);

  if (!fontLoaded || isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {user && regCompleted ? (
        isMember ? (
          <AppStack />
        ) : (
          <PaymentScreen setMember={setIsMember} />
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
