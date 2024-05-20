import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, TextInput} from 'react-native';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';

const m = defineMessages({
  descriptionPlaceholder: {
    id: 'screens.SaveTrack.TrackEditView.descriptionPlaceholder',
    defaultMessage: 'What is happening here?',
    description: 'Placeholder for description/notes field',
  },
});

export const TrackDescriptionField: React.FC = () => {
  const {formatMessage: t} = useIntl();
  const description = usePersistedTrack(state => state.description);
  const setDescription = usePersistedTrack(state => state.setDescription);
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
    paddingVertical: 20,
    minHeight: 100,
    fontSize: 20,
    color: 'black',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
