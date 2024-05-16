import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, TextInput} from 'react-native';

import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {useDraftObservation} from '../../hooks/useDraftObservation';

const m = defineMessages({
  descriptionPlaceholder: {
    id: 'screens.ObservationEdit.ObservationEditView.descriptionPlaceholder',
    defaultMessage: 'What is happening here?',
    description: 'Placeholder for description/notes field',
  },
});

export const DescriptionField = () => {
  const {formatMessage: t} = useIntl();
  const notes = usePersistedDraftObservation(store => store.value?.tags.notes);
  const {updateTags} = useDraftObservation();

  return (
    <TextInput
      style={styles.textInput}
      value={!notes || typeof notes !== 'string' ? '' : notes}
      onChangeText={newVal => {
        updateTags('notes', newVal);
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
