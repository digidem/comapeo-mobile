import * as React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Observation} from '@comapeo/schema';

type NumberProps = {
  updateTag: (value: number | null) => void;
  tagValue?: Observation['tags'][number];
};

export const Number = ({updateTag, tagValue}: NumberProps) => {
  const [text, setText] = React.useState(() => {
    if (typeof tagValue === 'number') return String(tagValue);
    if (typeof tagValue === 'string' && !isNaN(parseFloat(tagValue)))
      return tagValue;
    return '';
  });

  return (
    <>
      <TextInput
        testID="OBS.number-inp"
        value={text}
        onChangeText={newVal => {
          const sanitized = newVal
            .replace(/[^0-9.-]/g, '') // Allow digits, decimal, and negative sign
            .replace(/(?!^)-/g, '') // Remove any minus sign that is not at the start
            .replace(/(\..*?)\./g, '$1') // Remove additional decimal points
            .replace(/^(-?)0+([1-9])/, '$1$2'); // Remove leading zeros before non-zero digit
          setText(sanitized);
          if (sanitized === '') {
            updateTag(null);
            return;
          }
          const parsed = parseFloat(sanitized);
          if (!isNaN(parsed)) updateTag(parsed || 0); // "|| 0" normalized -0 to 0
        }}
        keyboardType="numeric"
        style={styles.textInput}
        underlineColorAndroid="transparent"
        multiline
        scrollEnabled={false}
        textContentType="none"
        autoFocus
      />
    </>
  );
};

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    minHeight: 150,
    fontSize: 20,
    padding: 20,
    marginBottom: 20,
    color: 'black',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
