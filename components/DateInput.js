import React, { useState } from 'react';
import { DateTimePickerModal as DateTimePicker } from 'react-native-modal-datetime-picker';
import { TextInput, TouchableOpacity } from 'react-native';

import { View } from './View';
import { Icon } from './Icon';
import { Text } from './Text';

import { Colors } from '../config';

const MIN_AGE = 21;

export const DateInput = ({ leftIconName, label, ...otherProps }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View
      style={{
        flex: 1,
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
          bold={true}
          heading={true}
          style={{
            flex: 1,
            color: Colors.black,
            fontSize: 14,
          }}
        >
          {label}
        </Text>
      )}
      {leftIconName ? (
        <Icon name={leftIconName} size={22} color={Colors.black} style={{ marginRight: 10 }} />
      ) : null}

      <TouchableOpacity
        onPress={() => {
          setShowDatePicker(true);
        }}
        underlayColor="white"
        style={{ width: '100%' }}
      >
        <TextInput
          editable={false}
          pointerEvents="none"
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
      </TouchableOpacity>

      <DateTimePicker
        isDarkModeEnabled={false}
        isVisible={showDatePicker}
        textColor={Colors.black}
        mode="date"
        value={new Date(new Date().setFullYear(new Date().getFullYear() - MIN_AGE))}
        maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - MIN_AGE))}
        minimumDate={new Date(1900, 0, 1)}
        onConfirm={(e) => {
          const date =
            (e.getMonth() + 1).toString().padStart(2, '0') +
            '-' +
            e.getDate().toString().padStart(2, '0') +
            '-' +
            e.getFullYear();
          setShowDatePicker(false);
          otherProps.onDateChange(date);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </View>
  );
};
