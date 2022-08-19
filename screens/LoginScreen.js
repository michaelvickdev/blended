import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Formik } from 'formik';
import {
  signInWithEmailAndPassword,
  AppleAuthProvider,
  GoogleAuthProvider,
  signInWithCredential,
  FacebookAuthProvider,
} from 'firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as Facebook from 'expo-facebook';
import Constants from 'expo-constants';

import { View, TextInput, Logo, Button, FormErrorMessage, Icon } from '../components';
import { Text } from '../components/Text';
import { Images, Colors, auth } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { loginValidationSchema } from '../utils';
import * as Google from 'expo-auth-session/providers/google';

export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { passwordVisibility, handlePasswordVisibility, rightIcon } = useTogglePasswordVisibility();
  const [, response, promptAsync] = Google.useAuthRequest({
    clientSecret: Constants.manifest.extra.googleClientSecret,
    expoClientId: Constants.manifest.extra.googleClientId,
  });
  const [isAppleLoginAvailable, setIsAppleLoginAvailable] = useState(false);

  const signInWithApple = async () => {
    try {
      const nonce = Math.random().toString(36).substring(2, 10);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce
      );
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (appleCredential) {
        const { identityToken } = appleCredential;
        const provider = new AppleAuthProvider();
        const credential = provider.credential(identityToken, nonce);
        await signInWithCredential(auth, credential);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithFb = async () => {
    try {
      await Facebook.initializeAsync({
        appId: Constants.manifest.extra.fbAppId,
      });
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });
      if (type === 'success') {
        const credential = FacebookAuthProvider.credential(token);
        await signInWithCredential(auth, credential);
      } else {
        throw new Error('Something went wrong');
      }
    } catch (error) {
      console.error(error);
      setErrorState('There was a problem signing in with Facebook');
    }
  };

  const handleLogin = (values) => {
    setIsLoading(true);
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      console.log(error);
      setErrorState('Invalid email or password');
      setIsLoading(false);
    });
  };

  React.useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setIsAppleLoginAvailable);
  }, []);

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { idToken, accessToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      signInWithCredential(auth, credential).catch((error) => {
        console.log(error);
        setErrorState('Google login failed');
      });
    }
  }, [response]);

  return (
    <View isSafe style={styles.container}>
      {/* LogoContainer: consits app logo and screen title */}
      <View style={styles.logoContainer}>
        <Logo uri={Images.logo} />
        {/*<Text style={styles.screenTitle}>Welcome back!</Text>*/}
      </View>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={loginValidationSchema}
        onSubmit={(values) => handleLogin(values)}
      >
        {({ values, touched, errors, handleChange, handleSubmit, handleBlur }) => (
          <>
            {/* Input fields */}
            <TextInput
              name="email"
              leftIconName="email"
              placeholder="Email Address"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoFocus={true}
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            <FormErrorMessage error={errors.email} visible={touched.email} />
            <TextInput
              name="password"
              leftIconName="key-variant"
              placeholder="Password"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={passwordVisibility}
              textContentType="password"
              rightIcon={rightIcon}
              handlePasswordVisibility={handlePasswordVisibility}
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
            />
            <FormErrorMessage error={errors.password} visible={touched.password} />
            {/* Display Screen Error Mesages */}
            {errorState !== '' ? <FormErrorMessage error={errorState} visible={true} /> : null}
            {/* Login button */}
            <Button style={styles.button} onPress={handleSubmit} disabled={isLoading}>
              <Text
                bold={true}
                style={[styles.buttonText, { color: isLoading ? Colors.lightGray : Colors.white }]}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Text>
            </Button>
          </>
        )}
      </Formik>
      {/* Button to navigate to SignupScreen to create a new account */}
      <View style={styles.socialSignIn}>
        <Button
          style={[styles.button, { flexDirection: 'row', width: '60%' }]}
          onPress={() => promptAsync()}
          disabled={isLoading}
        >
          <Icon name="google" size={20} color={Colors.white} style={{ marginRight: 8 }} />
          <Text bold={true} style={[styles.buttonText, { color: Colors.white }]}>
            Continue with Google
          </Text>
        </Button>

        <Button
          style={[styles.button, { flexDirection: 'row', width: '60%' }]}
          onPress={signInWithFb}
          disabled={isLoading}
        >
          <Icon name="facebook" size={20} color={Colors.white} style={{ marginRight: 8 }} />
          <Text bold={true} style={[styles.buttonText, { color: Colors.white }]}>
            Continue with Facebook
          </Text>
        </Button>
        {isAppleLoginAvailable && (
          <View style={{ alignItems: 'center', marginTop: 8 }}>
            <AppleAuthentication.AppleAuthenticationButton
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
              cornerRadius={25}
              onPress={signInWithApple}
              style={{ width: '60%', height: 40 }}
            />
          </View>
        )}
      </View>
      <View style={styles.footerButtonsContainer}>
        <View>
          <Text heading={true} bold={true}>
            Not a Member yet?
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            borderlessTitleStyle={styles.borderlessTitleStyle}
            title={'Join Now Free'}
            onPress={() => navigation.navigate('Signup')}
          />
          <Button
            style={styles.borderlessButtonRightContainer}
            borderless
            borderlessTitleStyle={styles.borderlessTitleStyle}
            title={'Forgot Password?'}
            onPress={() => navigation.navigate('ForgotPassword')}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <Text heading={true} bold={true} style={styles.footerText}>
          Blended Mates Social App v{Constants.manifest.version}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
  },
  // screenTitle: {
  //   fontSize: 32,
  //   fontWeight: '700',
  //   color: Colors.black,
  //   paddingTop: 20
  // },
  footer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
    paddingBottom: 48,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  footerText: {
    fontSize: 14,
    color: Colors.secondary,
  },
  button: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    shadowColor: Colors.black,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    fontSize: 16,
    textTransform: 'uppercase',
  },
  borderlessButtonContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 2,
  },
  borderlessButtonRightContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderLeftWidth: 2,
    borderColor: '#6e6869AA',
    paddingLeft: 10,
    paddingBottom: 2,
  },
  borderlessTitleStyle: {
    // color: Colors.red,
  },
  footerButtonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialSignIn: {
    marginVertical: 20,
  },
});
