import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity, Image } from 'react-native';
import { Icon } from './Icon';
import { View } from './View';
import { Colors } from '../config';
import { Text } from './Text';

export const ImageInput = ({ width = '100%', leftIconName, handleChange, label, free, video }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const pickImage = async (handleChange) => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();

    if (!granted) {
      alert('Please allow permission to continue uploading the image.');
      return;
    }
    const imgOptions = {
      ...(!free && { aspect: [4, 4] }),
      ...(video && {
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        videoQuality: ImagePicker.UIImagePickerControllerQualityType.Low,
      }),
    };

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      ...imgOptions,
    });
    if (!result.cancelled) {
      handleChange(result.uri, result.type);
      setImageUrl(result.uri);
    }
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 12,
        marginVertical: 4,
        width,
      }}
    >
      {label && (
        <TouchableOpacity
          onPress={() => {
            pickImage(handleChange);
          }}
          underlayColor="white"
          style={{ flex: 1, flexDirection: 'row' }}
        >
          {leftIconName ? (
            <Icon
              name={leftIconName}
              size={22}
              color={Colors.black}
              style={{ marginRight: 10, marginVertical: 4 }}
            />
          ) : null}

          <Text
            bold={true}
            heading={true}
            style={{
              flex: 1,
              color: Colors.black,
              paddingVertical: 4,
            }}
          >
            {label}
          </Text>
        </TouchableOpacity>
      )}

      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          resizeMode="contain"
          style={{ width: 32, marginLeft: 'auto', borderRadius: 5 }}
        />
      )}
    </View>
  );
};
