import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../config';

export const ITEM_WIDTH = 95;

export const PostCarouselItem = ({ item, index, openGallery }) => {
  return (
    <TouchableOpacity style={styles.imgContainer} key={index} onPress={() => openGallery(index)}>
      <Image source={item} style={styles.postImg} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
    backgroundColor: Colors.trueBlack,
    borderRadius: 15,
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    margin: 5,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  postImg: {
    width: '100%',
    height: 'auto',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
});
