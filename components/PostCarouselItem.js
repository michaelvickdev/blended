import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Image } from 'react-native';
import { View } from './View';
import { Colors } from '../config';
import { getImage } from '../hooks/getImage';
export const ITEM_WIDTH = 95;

export const PostCarouselItem = ({ item, index }) => {
  const mountedRef = useRef(true);
  const [imageUrl, setImageUrl] = useState(require('../assets/default-post.jpg'));
  const setImage = async () => {
    const image = await getImage(item.url);
    if (image && mountedRef.current) {
      setImageUrl(image);
    }
  };

  useEffect(() => {
    setImage();
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return (
    <View style={styles.imgContainer} key={index}>
      <Image source={imageUrl} style={styles.postImg} />
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
    overflow: 'hidden',
  },
  postImg: {
    width: '100%',
    height: 'auto',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
});
