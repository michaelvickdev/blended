import React, { useState, useContext } from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { fakeData } from '../assets/fakeData';
import { View } from '../components';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../config';
import { Post } from '../components/Post';
import { TextInput, Button } from '../components';
import { ImageInput } from '../components/ImageInput';
import { Formik } from 'formik';
import { Text } from '../components/Text';

import { addDoc, collection, setDoc } from 'firebase/firestore';
import { db } from '../config/';
import { uploadImage } from '../hooks/uploadImage';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import { uploadFeedsSchema } from '../utils';

const CURRENT_USER = 123456;
const currentPosts = fakeData.filter((single) => single.user.id == CURRENT_USER);

const Stack = createStackNavigator();
export const MyFeedsScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="MyFeeds"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MyFeeds" component={MyFeeds} />
      <Stack.Screen name="AddFeed" component={AddFeed} />
    </Stack.Navigator>
  );
};

const MyFeeds = () => {
  const [posts] = useState(currentPosts);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {posts.map((post) => (
          <Post key={post.post.id} user={post.user} post={post.post} />
        ))}
      </ScrollView>
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.mainFirst, Colors.mainSecond]}
      ></LinearGradient>
    </View>
  );
};

const AddFeed = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(false);
  const uploadFeed = async (values, resetForm) => {
    setIsLoading(true);
    try {
      const docRef = collection(db, 'feeds', user.uid, 'userFeeds');

      const feedRef = await addDoc(docRef, {
        title: values.title,
        likes: 0,
        comments: 0,
        uploadDate: new Date(),
      });

      if (values.image) {
        const imageName = user.uid + '_' + feedRef.id;
        await uploadImage(values.image, `feeds/${imageName}`);
        await setDoc(
          feedRef,
          {
            url: 'feeds/' + imageName,
          },
          { merge: true }
        );
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    setIsLoading(false);
  };

  return (
    <LinearGradient style={{ flex: 1, padding: 16 }} colors={[Colors.mainFirst, Colors.mainSecond]}>
      <Formik
        initialValues={{
          title: '',
          image: '',
        }}
        onSubmit={(values, { resetForm }) => uploadFeed(values, resetForm)}
        validationSchema={uploadFeedsSchema}
      >
        {({ values, handleChange, handleSubmit, handleBlur, setFieldValue }) => (
          <>
            <TextInput
              name="title"
              placeholder="Title"
              value={values.title}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
            />
            <ImageInput
              name="image"
              leftIconName="attachment"
              label="*Upload Pic"
              handleChange={(url) => setFieldValue('image', url)}
              onBlur={handleBlur('image')}
            />
            <Button style={styles.button} onPress={handleSubmit} disabled={isLoading}>
              <Text
                style={[styles.buttonText, { color: isLoading ? Colors.mediumGray : Colors.black }]}
              >
                {isLoading ? 'Submitting' : 'Submit'}
              </Text>
            </Button>
          </>
        )}
      </Formik>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
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
  button: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.white,
    padding: 6,
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
});
