import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileHeader } from '../components/ProfileHeader';
import { Colors } from '../config';
import { fakeData } from '../assets/fakeData';
import PostCarouselItem from '../components/PostCarouselItem';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from '../components/View';
import { Icon } from '../components';
const data = fakeData.map((post) => post.post);

export const MyProfileScreen = () => {
  return (
    <LinearGradient
      style={styles.container}
      colors={[Colors.mainFirst, Colors.mainSecond]}
    >
      <ProfileHeader user={fakeData[0].user} />
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {data.map((post, index) => (
            <PostCarouselItem item={post} index={index} key={index} />
          ))}
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 16,
          }}
        >
          <Icon name="facebook" size={54} />
          <Icon name="twitter" size={54} />
          <Icon name="linkedin" size={54} />
          <Icon name="github" size={54} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
