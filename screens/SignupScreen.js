import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { db, auth } from '../config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthenticatedUserContext } from '../providers';
import { doc, setDoc, collection, where, query, getDocs } from 'firebase/firestore';
import AwesomeAlert from 'react-native-awesome-alerts';

import { View, TextInput, Logo, Button, FormErrorMessage } from '../components';
import { Text } from '../components/Text';
import { Images, Colors } from '../config';
import { signupValidationSchema } from '../utils';
import { SelectInput } from '../components/SelectInput';
import { DateInput } from '../components/DateInput';
import { ImageInput } from '../components/ImageInput';
import { uploadImage } from '../hooks/uploadImage';
import Constants from 'expo-constants';

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { unsubscribe, setSignUpCounter } = useContext(AuthenticatedUserContext);
  const [showAlert, setShowAlert] = useState(false);

  //firestore check username already exists

  const checkUsername = async (username) => {
    const users = collection(db, 'users');
    const q = query(users, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;
  };

  const handleSignup = async (values) => {
    setIsLoading(true);
    const { email, image, username } = values;
    const usernameExists = await checkUsername(username);
    if (usernameExists) {
      setErrorState('Username already exists');
      setIsLoading(false);
      return;
    }

    const password = Math.floor(100000 + Math.random() * 900000).toString();

    ['image'].forEach((key) => delete values[key]);
    try {
      if (unsubscribe.current) unsubscribe.current();
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const docRef = doc(db, 'users', user.uid);

      await setDoc(docRef, {
        ...values,
        friends: [],
        requests: [],
        uid: user.uid,
        dateCreated: new Date(),
      });

      if (image) {
        const imageName = user.uid;
        await uploadImage(image, `dp/${imageName}`);
        await setDoc(
          docRef,
          {
            avatar: `dp/${imageName}`,
          },
          { merge: true }
        );
      }

      await fetch(
        `${Constants.manifest.extra.mailUrl}?` +
          new URLSearchParams({
            email: email,
            password: password,
            username: values.username,
          })
      );
      await auth.signOut();
      setShowAlert(true);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    setIsLoading(false);
  };

  return (
    <View isSafe style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentContainerStyle}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* LogoContainer: consits app logo and screen title */}
        <View style={styles.logoContainer}>
          <Logo uri={Images.logo} />
          {/*<Text style={styles.screenTitle}>Create a new account!</Text>*/}
        </View>
        {/* Formik Wrapper */}
        <Formik
          initialValues={{
            fullname: '',
            username: '',
            email: '',
            phone: '',
            city: '',
            about: '',
            gender: '',
            interested: '',
            dateOfBirth: '',
            image: '',
          }}
          validationSchema={signupValidationSchema}
          onSubmit={(values) => handleSignup(values)}
        >
          {({ values, touched, errors, handleChange, handleSubmit, handleBlur, setFieldValue }) => (
            <>
              {/* Input fields */}
              <TextInput
                name="fullname"
                leftIconName="information"
                placeholder="*Full Name"
                autoCapitalize="none"
                autoFocus={true}
                value={values.fullname}
                onChangeText={handleChange('fullname')}
                onBlur={handleBlur('fullname')}
              />
              <FormErrorMessage error={errors.fullname} visible={touched.fullname} />

              <TextInput
                name="username"
                leftIconName="account"
                placeholder="*Username"
                autoCapitalize="none"
                autoFocus={true}
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
              />
              <FormErrorMessage error={errors.username} visible={touched.username} />
              <TextInput
                name="email"
                leftIconName="email"
                placeholder="*Email Address"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              <FormErrorMessage error={errors.email} visible={touched.email} />
              <TextInput
                name="phone"
                leftIconName="phone"
                placeholder="*Enter Phone Number"
                autoCapitalize="none"
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
              />
              <FormErrorMessage error={errors.phone} visible={touched.phone} />
              <TextInput
                name="city"
                leftIconName="flag"
                placeholder="*City"
                autoCapitalize="words"
                value={values.city}
                onChangeText={handleChange('city')}
                onBlur={handleBlur('city')}
              />
              <FormErrorMessage error={errors.city} visible={touched.city} />
              <TextInput
                name="about"
                leftIconName="pencil"
                placeholder="*About You"
                autoCapitalize="sentences"
                value={values.about}
                onChangeText={handleChange('about')}
                onBlur={handleBlur('about')}
                multiline
                numberOfLines={3}
                textInputStyles={{ minHeight: 44, maxHeight: 88 }}
              />
              <FormErrorMessage error={errors.about} visible={touched.about} />

              <SelectInput
                name="gender"
                options={[
                  { name: 'Select Gender', id: '' },
                  { name: 'Male', id: 'male' },
                  { name: 'Female', id: 'female' },
                ]}
                value={values.gender}
                label="*Gender"
                onSelect={(val) => {
                  setFieldValue('interested', val == 'male' ? 'female' : 'male');
                  handleChange('gender')(val);
                }}
                onBlur={handleBlur('gender')}
              />
              <FormErrorMessage error={errors.gender} visible={touched.gender} />

              <SelectInput
                name="interested"
                options={[
                  ...(!values.gender
                    ? [{ name: 'Please select gender first', id: '' }]
                    : [{ name: 'Select Interest', id: '' }]),
                  ...(values.gender == 'male' ? [{ name: 'Female', id: 'female' }] : []),
                  ...(values.gender == 'female' ? [{ name: 'Male', id: 'male' }] : []),
                ]}
                value={values.interested}
                label="*Interested"
                onSelect={handleChange('interested')}
                onBlur={handleBlur('interested')}
              />
              <FormErrorMessage error={errors.interested} visible={touched.interested} />

              <DateInput
                name="dateOfBirth"
                placeholder="*Date of Birth"
                label="*Date of Birth"
                value={values.dateOfBirth}
                onDateChange={(date) => setFieldValue('dateOfBirth', date)}
                onBlur={handleBlur('dateOfBirth')}
              />
              <FormErrorMessage error={errors.dateOfBirth} visible={touched.dateOfBirth} />

              <ImageInput
                name="image"
                leftIconName="attachment"
                label="*Upload Pic"
                handleChange={(url) => setFieldValue('image', url)}
                onBlur={handleBlur('image')}
              />
              <FormErrorMessage error={errors.image} visible={touched.image} />

              {/* Display Screen Error Mesages */}
              {errorState !== '' ? <FormErrorMessage error={errorState} visible={true} /> : null}
              <Text style={styles.customText}>
                By using our app you agree to our Terms and conditions and Privacy Policy
              </Text>
              {/* Signup button */}
              <Button disabled={isLoading} style={styles.button} onPress={handleSubmit}>
                <Text
                  bold={true}
                  style={[
                    styles.buttonText,
                    { color: isLoading ? Colors.lightGray : Colors.white },
                  ]}
                >
                  {isLoading ? 'Loading...' : 'Signup'}
                </Text>
              </Button>
              <Text style={styles.customText}>
                Please check Spam/Junk folder for login password. Add extra social media and custom
                links including resume. Invite friends to Join the Circle. Manage Privacy/Visibility
                in the Inner Circle feature.
              </Text>
            </>
          )}
        </Formik>
        {/* Button to navigate to Login screen */}
        <View style={styles.footerButtonsContainer}>
          <Text bold={true} heading={true}>
            Already a Member?
          </Text>
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            borderlessTitleStyle={{ fontSize: 16 }}
            title={'Login'}
            onPress={() => {
              navigation.navigate('Login');
            }}
          />
        </View>
      </KeyboardAwareScrollView>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="User Created"
        message="We have mailed your credentials to the provided email. Please use them to sign in."
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="Ok"
        confirmButtonColor={Colors.secondary}
        onConfirmPressed={() => {
          setSignUpCounter((prev) => prev + 1);
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
  },
  contentContainerStyle: {
    paddingBottom: 60,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  footerButtonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});
