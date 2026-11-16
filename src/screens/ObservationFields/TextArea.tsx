import * as React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Observation} from '@comapeo/schema';

type TextProps = {
  updateTag: (value: string) => void;
  tagValue?: Observation['tags'][number];
};

export const TextArea = ({updateTag, tagValue}: TextProps) => {
  return (
    <TextInput
      testID="OBS.text-inp"
      value={typeof tagValue === 'string' ? tagValue : ''}
      onChangeText={newVal => updateTag(newVal)}
      style={styles.textInput}
      underlineColorAndroid="transparent"
      multiline
      scrollEnabled={false}
      textContentType="none"
      autoFocus
    />
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
