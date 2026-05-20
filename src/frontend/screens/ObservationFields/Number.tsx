import * as React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Observation} from '@comapeo/schema';

type NumberProps = {
  updateTag: (value: number) => void;
  tagValue?: Observation['tags'][number];
};

export const Number = ({updateTag, tagValue}: NumberProps) => {
  return (
    <>
      <TextInput
        testID="OBS.details-inp"
        value={typeof tagValue === 'number' ? String(tagValue) : ''}
        onChangeText={newVal =>
          updateTag(
            parseFloat(
              newVal
                .replace(/[^0-9.-]/g, '') // Allow digits, decimal, and negative sign
                .replace(/(?!^)-/g, '') // Remove any minus sign that is not at the start
                .replace(/(\..*?)\./g, '$1'), // Remove additional decimal points
            ),
          )
        }
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
