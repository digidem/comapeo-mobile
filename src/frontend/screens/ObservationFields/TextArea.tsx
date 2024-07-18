import * as React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {QuestionLabel} from './QuestionLabel';
import {Field} from '@mapeo/schema';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {useDraftObservation} from '../../hooks/useDraftObservation';

export const TextArea = React.memo<{field: Field}>(({field}) => {
  const tags = usePersistedDraftObservation(store => store.value?.tags);
  const {updateTags} = useDraftObservation();
  const value = tags ? tags[field.tagKey] : '';
  return (
    <React.Fragment>
      <QuestionLabel field={field} />
      <TextInput
        testID="OBS.details-inp"
        value={typeof value === 'string' ? value : ''}
        onChangeText={newVal => updateTags(field.tagKey, newVal)}
        style={styles.textInput}
        underlineColorAndroid="transparent"
        multiline
        scrollEnabled={false}
        textContentType="none"
        autoFocus
      />
    </React.Fragment>
  );
});

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
