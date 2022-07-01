import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { Text } from 'react-native';

import { View } from './View';
import { Icon } from './Icon';
import { Colors } from '../config';

export const SelectInput = ({
  width = '100%',
  leftIconName,
  selectInputStyles,
  options,
  label,
  ...otherProps
}) => {
  if (options)
    return (
      <View
        style={{
          backgroundColor: Colors.white,
          flexWrap: 'wrap',
          borderBottomWidth: 1,
          borderColor: Colors.black,
          marginRight: 10,
          marginLeft: 10,
          marginVertical: 12,
        }}
      >
        {label && (
          <Text
            style={{
              flex: 1,
              color: Colors.black,
              fontWeight: 'bold',
              fontSize: 14,
            }}
          >
            {label}
          </Text>
        )}
        {leftIconName ? (
          <Icon
            name={leftIconName}
            size={22}
            color={Colors.black}
            style={{ marginRight: 10 }}
          />
        ) : null}
        <Picker
          style={[
            {
              flex: 1,
              width: '100%',
              fontSize: 16,
              color: Colors.black,
            },
            selectInputStyles,
          ]}
          selectedValue={otherProps.value}
          onValueChange={otherProps.onSelect}
        >
          {options.map((option) => {
            return (
              <Picker.Item
                label={option.name.toString()}
                value={option.id.toString()}
                key={option.id.toString()}
              />
            );
          })}
        </Picker>
      </View>
    );
  return '';
};
