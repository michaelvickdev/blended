import React from 'react';
import { StyleSheet } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';

import { Text } from './Text';
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
  if (!options || !options.length) return null;
  return (
    <View
      style={{
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
        <Icon name={leftIconName} size={22} color={Colors.black} style={{ marginRight: 10 }} />
      ) : null}
      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{}}
        onValueChange={(value) => otherProps.onSelect(value)}
        value={otherProps.value || options[0].id.toString()}
        items={options.map((option) => ({
          label: option.name.toString(),
          value: option.id.toString(),
          key: option.id.toString(),
        }))}
      />
      {/*<Picker
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
      </Picker>*/}
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: Colors.black,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: Colors.black,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
