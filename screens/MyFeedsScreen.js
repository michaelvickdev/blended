import React, { useState } from 'react';
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

const handleSignup = (values) => {
  console.log(values);
};

const AddFeed = () => {
  return (
    <LinearGradient style={{ flex: 1, padding: 16 }} colors={[Colors.mainFirst, Colors.mainSecond]}>
      <Formik
        initialValues={{
          title: '',
          image: '',
        }}
        onSubmit={(values) => handleSignup(values)}
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
            <Button style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
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
    color: Colors.black,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
