import React, { useState } from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../config';
import { Button } from 'react-native-paper';
import { Formik } from 'formik';
import { View, TextInput, FormErrorMessage } from '../components';
import { changePasswordValidationSchema } from '../utils';
import { useTogglePasswordVisibility } from '../hooks';

import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

export const ChangePassword = () => {
  const [errorState, setErrorState] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility,
  } = useTogglePasswordVisibility();

  const handleSignup = async (values, resetForm) => {
    setIsLoading(true);
    try {
      //firebase change user password
      const auth = getAuth();
      const user = auth.currentUser;

      const oldPassword = values.oldPassword;
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      await updatePassword(user, values.password);
    } catch (err) {
      setErrorState('You have entered an invalid password.');
    }
    setIsLoading(false);
    resetForm();
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} scrollIndicatorInsets={{ right: 0 }}>
        <Formik
          initialValues={{
            oldPassword: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={changePasswordValidationSchema}
          onSubmit={(values, { resetForm }) => handleSignup(values, resetForm)}
        >
          {({ values, touched, errors, handleChange, handleSubmit, handleBlur }) => (
            <>
              {/* Input fields */}

              <TextInput
                name="oldPassword"
                leftIconName="key-variant"
                placeholder="*Old Password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType="password"
                rightIcon={rightIcon}
                handlePasswordVisibility={handlePasswordVisibility}
                value={values.oldPassword}
                onChangeText={handleChange('oldPassword')}
                onBlur={handleBlur('oldPassword')}
              />
              <FormErrorMessage error={errors.oldPassword} visible={touched.oldPassword} />

              <TextInput
                name="password"
                leftIconName="key-variant"
                placeholder="*New Password"
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
              <TextInput
                name="confirmPassword"
                leftIconName="key-variant"
                placeholder="*Confirm New Password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={confirmPasswordVisibility}
                textContentType="password"
                rightIcon={confirmPasswordIcon}
                handlePasswordVisibility={handleConfirmPasswordVisibility}
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
              />
              <FormErrorMessage error={errors.confirmPassword} visible={touched.confirmPassword} />

              {/* Display Screen Error Mesages */}
              {errorState !== '' ? <FormErrorMessage error={errorState} visible={true} /> : null}
              {/* Signup button */}
              <Button
                mode="contained"
                style={styles.button}
                onPress={handleSubmit}
                color={Colors.secondary}
                labelStyle={{ color: isLoading ? Colors.lightGray : Colors.white }}
              >
                {isLoading ? 'Updating...' : 'Update'}
              </Button>
            </>
          )}
        </Formik>
      </ScrollView>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.mainFirst, Colors.mainSecond]}
      ></LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    background: 'transparent',
    padding: 16,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: -1,
  },
  buttonTab: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 30,
    marginBottom: 12,
  },
  button: {
    borderColor: Colors.black,
  },
  edit: {
    flex: 1,
    paddingBottom: 24,
  },
  contentTab: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
});
