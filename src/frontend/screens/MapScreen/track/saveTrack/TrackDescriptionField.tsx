import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, TextInput} from 'react-native';

const m = defineMessages({
  descriptionPlaceholder: {
    id: 'screens.SaveTrack.TrackEditView.descriptionPlaceholder',
    defaultMessage: 'What is happening here?',
    description: 'Placeholder for description/notes field',
  },
});

interface DescriptionField {
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}
export const TrackDescriptionField: React.FC<DescriptionField> = ({
  description,
  setDescription,
}) => {
  const {formatMessage: t} = useIntl();

  return (
    <TextInput
      style={styles.textInput}
      onChangeText={setDescription}
      placeholder={t(m.descriptionPlaceholder)}
      placeholderTextColor="silver"
      underlineColorAndroid="transparent"
      multiline
      value={description}
      scrollEnabled={false}
      textContentType="none"
      testID="trackDescriptionField"
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    minHeight: 100,
    fontSize: 20,
    paddingHorizontal: 20,
    color: 'black',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
