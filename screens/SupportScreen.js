import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../config';
import { TextInput, Button } from '../components';
import { FormErrorMessage } from '../components';
import { Formik } from 'formik';
import { Text } from '../components/Text';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import { supportSchema } from '../utils';
import { addDoc, collection, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Icon } from '../components';

export const SupportScreen = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(false);
  const submitComment = async (values, resetForm) => {
    setIsLoading(true);
    try {
      // send feedback to firestore
      const docRef = collection(db, 'support');
      await addDoc(docRef, {
        user: user.uid,
        comment: values.comment,
        createdAt: new Date(),
      });
      resetForm();
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <LinearGradient style={{ flex: 1, padding: 16 }} colors={[Colors.mainFirst, Colors.mainSecond]}>
      <Text>If you have anyquestions or comments, please leave below.</Text>
      <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
        <Formik
          initialValues={{
            comment: '',
          }}
          onSubmit={(values, { resetForm }) => submitComment(values, resetForm)}
          validationSchema={supportSchema}
        >
          {({ errors, touched, values, handleChange, handleSubmit, handleBlur }) => (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="pencil" size={22} color={Colors.black} style={{ marginRight: 10 }} />
                <Text
                  bold={true}
                  heading={true}
                  style={{
                    flex: 1,
                    color: Colors.black,
                    fontSize: 14,
                  }}
                >
                  Contact Us
                </Text>
              </View>
              <TextInput
                name="comment"
                label="Comment"
                placeholder="Write your comment here"
                value={values.comment}
                onChangeText={handleChange('comment')}
                onBlur={handleBlur('comment')}
                multiline
                numberOfLines={3}
              />
              <FormErrorMessage error={errors.fullname} visible={touched.fullname} />

              <Button style={styles.button} onPress={handleSubmit} disabled={isLoading}>
                <Text
                  style={[
                    styles.buttonText,
                    { color: isLoading ? Colors.mediumGray : Colors.black },
                  ]}
                >
                  {isLoading ? 'Submitting' : 'Submit'}
                </Text>
              </Button>
            </>
          )}
        </Formik>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
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
