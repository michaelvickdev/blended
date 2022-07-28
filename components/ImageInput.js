import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { TouchableHighlight } from 'react-native';
import { Icon } from './Icon';
import { View } from './View';
import { Colors } from '../config';
import { Text } from './Text';

export const ImageInput = ({ width = '100%', leftIconName, handleChange, label, free }) => {
  const pickImage = async (handleChange) => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();

    if (!granted) {
      alert('Please allow permission to continue uploading the image.');
      return;
    }
    const imgOptions = free ? {} : { aspect: [4, 4] };

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      ...imgOptions,
    });
    if (!result.cancelled) {
      handleChange(result.uri);
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
      {leftIconName ? (
        <Icon
          name={leftIconName}
          size={22}
          color={Colors.black}
          style={{ marginRight: 10, marginVertical: 4 }}
        />
      ) : null}

      {label && (
        <TouchableHighlight
          onPress={() => {
            pickImage(handleChange);
          }}
          underlayColor="white"
        >
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
        </TouchableHighlight>
      )}
    </View>
  );
};
