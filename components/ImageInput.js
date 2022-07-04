import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Text, TouchableHighlight } from 'react-native';
import { Icon } from './Icon';
import { View } from './View';
import { Colors } from '../config';

export const ImageInput = ({
  width = '100%',
  leftIconName,
  handleChange,
  label,
}) => {
  const pickImage = async (handleChange) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Please allow permission to continue uploading the image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync();
    console.log(result);
    if (!result.cancelled) {
      handleChange(result.uri);
    }
  };
  return (
    <View
      style={{
        backgroundColor: Colors.white,
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
            style={{
              flex: 1,
              color: Colors.black,
              fontWeight: 'bold',
              fontSize: 16,
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
