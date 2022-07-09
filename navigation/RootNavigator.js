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

const customFonts = {
  poppinsLight: require('../assets/fonts/Poppins-Light.ttf'),
  poppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
  futura: require('../assets/fonts/Futura.ttf'),
  futuraBold: require('../assets/fonts/Futura-Bold.ttf'),
};

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [fontLoaded] = useFonts(customFonts);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(auth, (authenticatedUser) => {
      authenticatedUser ? setUser(authenticatedUser) : setUser(null);
      setIsLoading(false);
    });

    // unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, [user]);

  if (isLoading || !fontLoaded) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
