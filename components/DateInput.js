import React, { useState } from 'react';
import { DateTimePickerModal as DateTimePicker } from 'react-native-modal-datetime-picker';
import { TextInput, TouchableHighlight } from 'react-native';

import { View } from './View';
import { Icon } from './Icon';
import { Text } from './Text';

import { Colors } from '../config';

export const DateInput = ({
  width = '100%',
  leftIconName,
  selectInputStyles,
  options,
  label,
  ...otherProps
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View
      style={{
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
        <Icon name={leftIconName} size={22} color={Colors.black} style={{ marginRight: 10 }} />
      ) : null}

      <TouchableHighlight
        onPress={() => {
          setShowDatePicker(true);
        }}
        underlayColor="white"
      >
        <TextInput
          editable={false}
          style={[
            {
              flex: 1,
              fontSize: 16,
              color: Colors.black,
              padding: 12,
            },
          ]}
          placeholderTextColor={Colors.mediumGray}
          {...otherProps}
        />
      </TouchableHighlight>

      <DateTimePicker
        isVisible={showDatePicker}
        mode="date"
        value={new Date()}
        maximumDate={new Date()}
        minimumDate={new Date(1900, 0, 1)}
        display="spinner"
        onConfirm={(e) => {
          const date =
            e.getDate().toString().padStart(2, '0') +
            '-' +
            (e.getMonth() + 1).toString().padStart(2, '0') +
            '-' +
            e.getFullYear();
          console.log(date);
          setShowDatePicker(false);
          otherProps.onDateChange(date);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </View>
  );
};
