import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, TextInput} from 'react-native';
import Field from './Field';
import React from 'react';

const m = defineMessages({
  descriptionPlaceholder: {
    id: 'screens.ObservationEdit.ObservationEditView.descriptionPlaceholder',
    defaultMessage: 'What is happening here?',
    description: 'Placeholder for description/notes field',
  },
});

const notesField = {
  id: 'notes',
  type: 'text',
  multiline: true,
  key: 'notes',
};

export const DescriptionField = () => {
  const {formatMessage: t} = useIntl();
  const [value, setValue] = React.useState('');
  return (
    <TextInput
      style={styles.textInput}
      value={value}
      onChangeText={newVal => {
        setValue(newVal);
      }}
      placeholder={t(m.descriptionPlaceholder)}
      placeholderTextColor="silver"
      underlineColorAndroid="transparent"
      multiline
      scrollEnabled={false}
      textContentType="none"
      testID="observationDescriptionField"
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    minHeight: 100,
    fontSize: 20,
    padding: 20,
    color: 'black',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
