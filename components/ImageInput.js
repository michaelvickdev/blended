import React from 'react';
import { ImagePicker } from 'expo';
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
  const pickImage = (handleChange) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
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
