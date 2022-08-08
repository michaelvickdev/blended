import React, { useState, useContext, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from '../components';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../config';
import { Post } from '../components/Post';
import { TextInput, Button } from '../components';
import { ImageInput } from '../components/ImageInput';
import { Formik } from 'formik';
import { Comments } from './CommentScreen';
import { Text } from '../components/Text';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';

import { addDoc, collection, setDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../config/';
import { uploadImage } from '../hooks/uploadImage';
import { uploadFeedsSchema } from '../utils';

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
      <Stack.Screen name="Comments" component={Comments} />
    </Stack.Navigator>
  );
};

const MyFeeds = ({ navigation }) => {
  const mountedRef = useRef(true);
  const { user, changeCounter } = useContext(AuthenticatedUserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPosts = async () => {
    const docRef = collection(db, 'feeds');
    const q = query(docRef, where('uid', '==', user.uid), orderBy('uploadDate', 'desc'));
    const docSnap = await getDocs(q);

    const feedData = docSnap.docs.map((doc) => ({
      ...doc.data(),
      feedId: doc.id,
    }));

    if (mountedRef.current) {
      setPosts(feedData);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getPosts();
  }, [changeCounter]);

  useEffect(() => () => (mountedRef.current = false));

  if (!posts.length) {
    return (
      <LinearGradient
        style={{ flex: 1, padding: 16 }}
        colors={[Colors.mainFirst, Colors.mainSecond]}
      >
        <Text style={{ fontSize: 16, textAlign: 'center' }}>
          {loading ? 'Loading...' : 'No feeds to show'}
        </Text>
      </LinearGradient>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} scrollIndicatorInsets={{ right: 0 }}>
        {posts.map((post, index) => (
          <Post key={index} navigation={navigation} post={post} />
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
  const { user, setChangeCounter } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(false);
  const uploadFeed = async (values, resetForm) => {
    setIsLoading(true);
    try {
      const docRef = collection(db, 'feeds');

      const feedRef = await addDoc(docRef, {
        uid: user.uid,
        title: values.title,
        likes: [],
        comments: [],
        reported: [],
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
      setChangeCounter((prev) => prev + 1);
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
              free={true}
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
