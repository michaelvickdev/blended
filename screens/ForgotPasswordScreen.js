import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Formik } from 'formik';
import { sendPasswordResetEmail } from 'firebase/auth';

import { passwordResetSchema } from '../utils';
import { Colors, auth, Images } from '../config'
import { View, TextInput, Button, FormErrorMessage, Logo } from '../components'

export const ForgotPasswordScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');

  const handleSendPasswordResetEmail = values => {
    const { email } = values;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Success: Password Reset Email sent.');
        navigation.navigate('Login');
      })
      .catch(error => setErrorState(error.message));
  };

  return (
    <View isSafe style={styles.container}>
      <View style={styles.innerContainer}>
        <Logo uri={Images.logo} />
        {/*<Text style={styles.screenTitle}>Reset your password</Text>*/}
      </View>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={passwordResetSchema}
        onSubmit={values => handleSendPasswordResetEmail(values)}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleSubmit,
          handleBlur
        }) => (
          <>
            {/* Email input field */}
            <TextInput
              name='email'
              leftIconName='email'
              placeholder='Email Address'
              autoCapitalize='none'
              keyboardType='email-address'
              textContentType='emailAddress'
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            <FormErrorMessage error={errors.email} visible={touched.email} />
            {/* Display Screen Error Mesages */}
            {errorState !== '' ? (
              <FormErrorMessage error={errorState} visible={true} />
            ) : null}
            {/* Password Reset Send Email  button */}
            <Button style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </Button>
          </>
        )}
      </Formik>
      {/* Button to navigate to Login screen */}
      <View style={styles.footerButtonsContainer}>
        <Text style={styles.boldText}>Not a Member yet?</Text>
        <Button
          style={styles.borderlessButtonContainer}
          borderless
          borderlessTitleStyle={{ fontSize: 15 }}
          title={'Join Now for Free'}
          onPress={() => navigation.navigate('Signup')}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 15
  },
  innerContainer: {
    alignItems: 'center'
  },
  // screenTitle: {
  //   fontSize: 32,
  //   fontWeight: '700',
  //   color: Colors.black,
  //   paddingTop: 20
  // },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 20,
    shadowColor: Colors.black,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 }
  },
  buttonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  borderlessButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  footerButtonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  boldText: {
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.black,
  }
});
