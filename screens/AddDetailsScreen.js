import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { db } from '../config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthenticatedUserContext } from '../providers';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';

import { View, TextInput, Logo, Button, FormErrorMessage } from '../components';
import { Text } from '../components/Text';
import { Images, Colors } from '../config';
import { addDetailsValidationScema } from '../utils';
import { SelectInput } from '../components/SelectInput';
import { DateInput } from '../components/DateInput';
import { ImageInput } from '../components/ImageInput';
import { uploadImage } from '../hooks/uploadImage';

export const AddDetailsScreen = ({ showDetails }) => {
  const [errorState, setErrorState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthenticatedUserContext);

  const checkUsername = async (username) => {
    const users = collection(db, 'users');
    const q = query(users, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;
  };

  const addDetails = async (values) => {
    setIsLoading(true);
    const { image, username } = values;
    const usernameExists = await checkUsername(username);
    if (usernameExists) {
      setErrorState('Username already exists');
      setIsLoading(false);
      return;
    }
    ['image'].forEach((key) => delete values[key]);
    try {
      const docRef = doc(db, 'users', user.uid);

      await setDoc(docRef, {
        ...values,
        friends: [],
        requests: [],
        uid: user.uid,
        trial: true,
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
    } catch (err) {
      setErrorState('Something went wrong, please try again.');
      console.error(err);
      alert(err.message);
    }
    setIsLoading(false);
    showDetails(false);
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
          <Text bold={true} style={styles.screenTitle}>
            Welocome, please add the following details:
          </Text>
        </View>
        {/* Formik Wrapper */}
        <Formik
          initialValues={{
            fullname: '',
            username: '',
            phone: '',
            city: '',
            about: '',
            gender: '',
            interested: '',
            dateOfBirth: '',
            image: '',
          }}
          validationSchema={addDetailsValidationScema}
          onSubmit={(values) => addDetails(values)}
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
                onSelect={handleChange('gender')}
                onBlur={handleBlur('gender')}
              />
              <FormErrorMessage error={errors.gender} visible={touched.gender} />

              <SelectInput
                name="interested"
                options={[
                  { name: 'Select Interest', id: '' },
                  { name: 'Male', id: 'male' },
                  { name: 'Female', id: 'female' },
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

              {/* Signup button */}
              <Button disabled={isLoading} style={styles.button} onPress={handleSubmit}>
                <Text
                  bold={true}
                  style={[
                    styles.buttonText,
                    { color: isLoading ? Colors.lightGray : Colors.white },
                  ]}
                >
                  {isLoading ? 'Adding...' : 'Add Details'}
                </Text>
              </Button>
            </>
          )}
        </Formik>
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
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 18,
    color: Colors.black,
    paddingVertical: 10,
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
