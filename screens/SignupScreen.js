import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { View, TextInput, Logo, Button, FormErrorMessage } from '../components';
import { Images, Colors, auth } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { signupValidationSchema } from '../utils';

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility
  } = useTogglePasswordVisibility();

  const handleSignup = async values => {
    const { email, password } = values;

    createUserWithEmailAndPassword(auth, email, password).catch(error =>
      setErrorState(error.message)
    );
  };

  return (
    <View isSafe style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentContainerStyle}
        enableOnAndroid={true}
      >
        {/* LogoContainer: consits app logo and screen title */}
        <View style={styles.logoContainer}>
          <Logo uri={Images.logo} />
          {/*<Text style={styles.screenTitle}>Create a new account!</Text>*/}
        </View>
        {/* Formik Wrapper */}
        <Formik
          initialValues={{
            username: '',
            email: '',
            phone: '',
            city: '',
            about: '',
            password: '',
            confirmPassword: '',
            dateOfBirth: '',
          }}
          validationSchema={signupValidationSchema}
          onSubmit={values => handleSignup(values)}
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
              {/* Input fields */}
              <TextInput
                name='username'
                leftIconName='account'
                placeholder='*Username'
                autoCapitalize='none'
                autoFocus={true}
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
              />
              <FormErrorMessage error={errors.username} visible={touched.username} />
              <TextInput
                name='email'
                leftIconName='email'
                placeholder='*Email Address'
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              <FormErrorMessage error={errors.email} visible={touched.email} />
              <TextInput
                name='phone'
                leftIconName='phone'
                placeholder='*Phone Number'
                autoCapitalize='none'
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
              />
              <FormErrorMessage error={errors.phone} visible={touched.phone} />
              <TextInput
                name='city'
                leftIconName='city'
                placeholder='*City'
                autoCapitalize='words'
                value={values.city}
                onChangeText={handleChange('city')}
                onBlur={handleBlur('city')}
              />
              <FormErrorMessage error={errors.city} visible={touched.city} />
              <TextInput
                name='about'
                leftIconName='pencil'
                placeholder='*About You'
                autoCapitalize='sentences'
                value={values.about}
                onChangeText={handleChange('about')}
                onBlur={handleBlur('about')}
                multiline
                numberOfLines={3}
                textInputStyles={{ minHeight: 44, maxHeight: 88 }}
              />
              <FormErrorMessage error={errors.about} visible={touched.about} />
              <TextInput
                name='password'
                leftIconName='key-variant'
                placeholder='*Password'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType='newPassword'
                rightIcon={rightIcon}
                handlePasswordVisibility={handlePasswordVisibility}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
              />
              <FormErrorMessage
                error={errors.password}
                visible={touched.password}
              />
              <TextInput
                name='confirmPassword'
                leftIconName='key-variant'
                placeholder='*Confirm Password'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={confirmPasswordVisibility}
                textContentType='password'
                rightIcon={confirmPasswordIcon}
                handlePasswordVisibility={handleConfirmPasswordVisibility}
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
              />
              <FormErrorMessage
                error={errors.confirmPassword}
                visible={touched.confirmPassword}
              />
              <TextInput
                name='dateOfBirth'
                placeholder='*Date of Birth'
                autoCapitalize='none'
                value={values.dateOfBirth}
                onChangeText={handleChange('dateOfBirth')}
                onBlur={handleBlur('dateOfBirth')}
              />
              <FormErrorMessage error={errors.dateOfBirth} visible={touched.dateOfBirth} />
              {/* Display Screen Error Mesages */}
              {errorState !== '' ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null}
              <Text style={styles.customText}>
                By using our app you agree to our Terms and conditions
                and Privacy Policy
              </Text>
              {/* Signup button */}
              <Button style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Signup</Text>
              </Button>
              <Text style={styles.customText}>
                Please check Spam/Junk folder for login password. Add extra
                social media and custom links including resume. Invite
                friends to Join the Circle. Manage Privacy/Visibility in the
                Inner Circle feature.
              </Text>
            </>
          )}
        </Formik>
        {/* Button to navigate to Login screen */}
        <View style={styles.footerButtonsContainer}>
          <Text style={styles.boldText}>Already a Member?</Text>
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            borderlessTitleStyle={{ fontSize: 16 }}
            title={'Login'}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainerStyle: {
    paddingBottom: 60,
    paddingHorizontal: 15,
  },
  logoContainer: {
    alignItems: 'center'
  },
  // screenTitle: {
  //   fontSize: 32,
  //   fontWeight: '700',
  //   color: Colors.black,
  //   paddingTop: 20
  // },
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
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.black,
  },
  customText: {
    marginVertical: 20,
    fontSize: 13,
    color: Colors.black,
  }
});