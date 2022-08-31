import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '../components/Text';
import { Formik } from 'formik';
import Constants from 'expo-constants';

import { passwordResetSchema } from '../utils';
import { Colors, Images } from '../config';
import { View, TextInput, Button, FormErrorMessage, Logo } from '../components';
import AwesomeAlert from 'react-native-awesome-alerts';

export const ForgotPasswordScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendPasswordResetEmail = async (values) => {
    setLoading(true);
    const { email } = values;
    try {
      const { status } = await fetch(
        `${Constants.manifest.extra.forgetUrl}?` +
          new URLSearchParams({
            email: email,
          })
      );
      if (status == 'success') {
        setShowAlert(true);
      } else {
        setErrorState('Please enter a valid email address.');
      }
    } catch (error) {
      setErrorState(error.message);
    }
    setLoading(false);
  };

  return (
    <View isSafe style={styles.container}>
      <View style={styles.innerContainer}>
        <Logo uri={Images.logo} />
      </View>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={passwordResetSchema}
        onSubmit={(values) => handleSendPasswordResetEmail(values)}
      >
        {({ values, touched, errors, handleChange, handleSubmit, handleBlur }) => (
          <>
            <TextInput
              name="email"
              leftIconName="email"
              placeholder="Email Address"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            <FormErrorMessage error={errors.email} visible={touched.email} />

            {errorState !== '' ? <FormErrorMessage error={errorState} visible={true} /> : null}

            <Button disabled={loading} style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{loading ? 'Resetting' : 'Reset Password'}</Text>
            </Button>
          </>
        )}
      </Formik>

      <View style={styles.footerButtonsContainer}>
        <Text bold={true}>Not a Member yet?</Text>
        <Button
          style={styles.borderlessButtonContainer}
          borderless
          borderlessTitleStyle={{ fontSize: 15 }}
          title={'Join Now for Free'}
          onPress={() => navigation.navigate('Signup')}
        />
      </View>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Success"
        message="Password reset email sent, press 'Ok' to continue."
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="Ok"
        confirmButtonColor={Colors.secondary}
        onConfirmPressed={() => {
          navigation.navigate('Login');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
  },
  innerContainer: {
    alignItems: 'center',
  },
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
    shadowOffset: { width: 0, height: 2 },
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
});
