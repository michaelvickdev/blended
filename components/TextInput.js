import React from 'react';
import { TextInput as RNTextInput } from 'react-native';

import { View } from './View';
import { Icon } from './Icon';
import { Button } from './Button';
import { Colors } from '../config';

export const TextInput = ({
  width = '100%',
  leftIconName,
  rightIcon,
  handlePasswordVisibility,
  textInputStyles,
  ...otherProps
}) => {
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
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderColor: Colors.black,
        }}
      >
        <RNTextInput
          style={[
            {
              flex: 1,
              fontSize: 16,
              color: Colors.black,
              paddingVertical: 4,
              paddingHorizontal: 12,
              textAlignVertical: 'top',
            },
            textInputStyles,
          ]}
          placeholderTextColor={Colors.mediumGray}
          {...otherProps}
        />
        {rightIcon ? (
          <Button onPress={handlePasswordVisibility}>
            <Icon
              name={rightIcon}
              size={22}
              color={Colors.black}
              style={{ marginRight: 10 }}
            />
          </Button>
        ) : null}
      </View>
    </View>
  );
};
