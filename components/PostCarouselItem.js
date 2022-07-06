import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { View } from './View';
import { Colors } from '../config';
export const ITEM_WIDTH = 95;

export default PostCarouselItem = ({ item, index }) => {
  return (
    <View style={styles.imgContainer} key={index}>
      <Image source={{ uri: item.url }} style={styles.postImg} />
    </View>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
    backgroundColor: Colors.trueBlack,
    borderRadius: 15,
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    margin: 5,
  },
  postImg: {
    width: '100%',
    height: 'auto',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
});
