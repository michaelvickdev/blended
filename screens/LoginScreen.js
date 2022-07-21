import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Constants from 'expo-constants';

import { View, TextInput, Logo, Button, FormErrorMessage } from '../components';
import { Text } from '../components/Text';
import { Images, Colors, auth } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { loginValidationSchema } from '../utils';

export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { passwordVisibility, handlePasswordVisibility, rightIcon } = useTogglePasswordVisibility();

  const handleLogin = (values) => {
    setIsLoading(true);
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      setErrorState(error.message);
      setIsLoading(false);
    });
  };
  return (
    <>
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
                placeholder="Email Address / Username"
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
                  style={[
                    styles.buttonText,
                    { color: isLoading ? Colors.mediumGray : Colors.white },
                  ]}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Text>
              </Button>
            </>
          )}
        </Formik>
        {/* Button to navigate to SignupScreen to create a new account */}
        <View style={styles.footerButtonsContainer}>
          <View>
            <Text style={styles.boldText}>Not a Member yet?</Text>
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
      </View>

      {/* App info footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Blended Mates Social App v{Constants.manifest.version}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
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
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
    paddingBottom: 48,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '700',
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
    fontWeight: '700',
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
    marginTop: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  boldText: {
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.black,
  },
});
