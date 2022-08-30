import React, { useState, useContext, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileHeader } from '../components/ProfileHeader';
import { Colors } from '../config';
import { Button } from 'react-native-paper';
import { Formik } from 'formik';
import { View, TextInput, FormErrorMessage } from '../components';
import { SelectInput } from '../components/SelectInput';
import { personalInfoValidationSchema, socialLinksValidationSchema } from '../utils';
import { DateInput } from '../components/DateInput';
import * as ImagePicker from 'expo-image-picker';
import { AuthenticatedUserContext } from '../providers';
import { uploadImage } from '../hooks/uploadImage';

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export const EditProfileScreen = () => {
  const mountedRef = useRef(true);
  const [errorState] = useState('');
  const [toggleTab, setToggle] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const { user, setChangeCounter } = useContext(AuthenticatedUserContext);

  const getUserData = async () => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && mountedRef.current) {
      setUserData({ ...docSnap.data(), avatar: docSnap.data().avatar });
    } else {
      console.log('No such document!');
    }
  };

  useEffect(() => {
    getUserData();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleSignup = async (values) => {
    setIsLoading(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(
        docRef,
        {
          ...values,
        },
        { merge: true }
      );
      setChangeCounter((prev) => prev + 1);
      getUserData();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    setIsLoading(false);
  };

  const handleSocialLinks = async (values) => {
    setIsLoading(true);

    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(
        docRef,
        {
          socialLinks: values,
        },
        { merge: true }
      );
      setChangeCounter((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }

    setIsLoading(false);
  };

  const pickImage = async () => {
    setIsLoading(true);
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();

    if (!granted) {
      alert('Please allow permission to continue uploading the image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
    });
    if (!result.cancelled) {
      const imageUri = result.uri;
      const imageName = user.uid;
      await uploadImage(imageUri, `dp/${imageName}`);
      const docRef = doc(db, 'users', user.uid);
      await setDoc(
        docRef,
        {
          avatar: `dp/${imageName}`,
        },
        { merge: true }
      );
      setChangeCounter((prev) => prev + 1);
      await getUserData();
    }
    setIsLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        style={styles.container}
        automaticallyAdjustsScrollIndicatorInsets={false}
        scrollIndicatorInsets={{ right: Number.MIN_VALUE }}
        keyboardShouldPersistTaps="handled"
      >
        {userData && <ProfileHeader user={userData} noBio={true} />}
        <View style={styles.edit}>
          <Button
            mode="contained"
            onPress={pickImage}
            style={styles.button}
            color={Colors.secondary}
            labelStyle={{ color: isLoading ? Colors.lightGray : Colors.white }}
          >
            {isLoading ? 'Uploading...' : 'Upload Photo'}
          </Button>
          <View style={styles.tabs}>
            <View style={styles.buttonTab}>
              <Button
                mode="contained"
                compact
                onPress={() => setToggle(true)}
                style={styles.button}
                color={!toggleTab ? Colors.white : Colors.lightGray}
                textColor={Colors.white}
                labelStyle={{ color: Colors.black }}
              >
                Personal Info
              </Button>
              <Button
                mode="contained"
                compact
                onPress={() => setToggle(false)}
                style={styles.button}
                color={toggleTab ? Colors.white : Colors.lightGray}
                labelStyle={{ color: Colors.black }}
              >
                Social Links
              </Button>
            </View>
            <View style={styles.contentTab}>
              {toggleTab && (
                <View style={styles.personalInfo}>
                  {userData && (
                    <Formik
                      initialValues={{
                        fullname: userData.fullname,
                        email: userData.email,
                        phone: userData.phone,
                        city: userData.city,
                        about: userData.about,
                        gender: userData.gender,
                        interested: userData.interested,
                        dateOfBirth: userData.dateOfBirth,
                      }}
                      validationSchema={personalInfoValidationSchema}
                      onSubmit={(values) => handleSignup(values)}
                    >
                      {({
                        values,
                        touched,
                        errors,
                        handleChange,
                        handleSubmit,
                        handleBlur,
                        setFieldValue,
                      }) => (
                        <>
                          {/* Input fields */}
                          <TextInput
                            name="fullname"
                            leftIconName="information"
                            placeholder="*Full Name"
                            autoCapitalize="none"
                            value={values.fullname}
                            onChangeText={handleChange('fullname')}
                            onBlur={handleBlur('fullname')}
                          />
                          <FormErrorMessage error={errors.fullname} visible={touched.fullname} />

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
                              { name: 'Male', id: 0 },
                              { name: 'Female', id: 1 },
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
                              { name: 'Male', id: 0 },
                              { name: 'Female', id: 1 },
                            ]}
                            value={values.interested}
                            label="*Interested"
                            onSelect={handleChange('interested')}
                            onBlur={handleBlur('interested')}
                          />
                          <FormErrorMessage
                            error={errors.interested}
                            visible={touched.interested}
                          />

                          <DateInput
                            name="dateOfBirth"
                            placeholder="*Date of Birth"
                            label="*Date of Birth"
                            value={values.dateOfBirth}
                            onDateChange={(date) => setFieldValue('dateOfBirth', date)}
                            onBlur={handleBlur('dateOfBirth')}
                          />
                          <FormErrorMessage
                            error={errors.dateOfBirth}
                            visible={touched.dateOfBirth}
                          />

                          {/* Display Screen Error Mesages */}
                          {errorState !== '' ? (
                            <FormErrorMessage error={errorState} visible={true} />
                          ) : null}
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
                  )}
                </View>
              )}
              {!toggleTab && (
                <View style={styles.socialLinks}>
                  {userData && (
                    <Formik
                      initialValues={{
                        facebook: 'socialLinks' in userData ? userData.socialLinks.facebook : '',
                        instagram: 'socialLinks' in userData ? userData.socialLinks.instagram : '',
                        twitter: 'socialLinks' in userData ? userData.socialLinks.twitter : '',
                        linkedin: 'socialLinks' in userData ? userData.socialLinks.linkedin : '',
                      }}
                      validationSchema={socialLinksValidationSchema}
                      onSubmit={(values) => handleSocialLinks(values)}
                    >
                      {({ values, touched, errors, handleChange, handleSubmit, handleBlur }) => (
                        <>
                          {/* Input fields */}
                          <TextInput
                            name="facebook"
                            leftIconName="facebook"
                            placeholder="Enter Facebook Link"
                            autoCapitalize="none"
                            value={values.facebook}
                            onChangeText={handleChange('facebook')}
                            onBlur={handleBlur('facebook')}
                          />
                          <FormErrorMessage error={errors.facebook} visible={touched.facebook} />

                          <TextInput
                            name="instagram"
                            leftIconName="instagram"
                            placeholder="Enter Instagram Link"
                            autoCapitalize="none"
                            value={values.instagram}
                            onChangeText={handleChange('instagram')}
                            onBlur={handleBlur('instagram')}
                          />
                          <FormErrorMessage error={errors.instagram} visible={touched.instagram} />

                          <TextInput
                            name="linkedin"
                            leftIconName="linkedin"
                            placeholder="Enter LinkedIn Link"
                            autoCapitalize="none"
                            value={values.linkedin}
                            onChangeText={handleChange('linkedin')}
                            onBlur={handleBlur('linkedin')}
                          />
                          <FormErrorMessage error={errors.linkedin} visible={touched.linkedin} />

                          <TextInput
                            name="twitter"
                            leftIconName="twitter"
                            placeholder="Enter Twitter Link"
                            autoCapitalize="none"
                            value={values.twitter}
                            onChangeText={handleChange('twitter')}
                            onBlur={handleBlur('twitter')}
                          />
                          <FormErrorMessage error={errors.twitter} visible={touched.twitter} />

                          {/* Display Screen Error Mesages */}
                          {errorState !== '' ? (
                            <FormErrorMessage error={errorState} visible={true} />
                          ) : null}
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
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
