import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, TextInput} from 'react-native';
import Field from './Field';

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
  return (
    <Field field={notesField}>
      {({value, onChange}) => (
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChange}
          placeholder={t(m.descriptionPlaceholder)}
          placeholderTextColor="silver"
          underlineColorAndroid="transparent"
          multiline
          scrollEnabled={false}
          textContentType="none"
          testID="observationDescriptionField"
        />
      )}
    </Field>
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
