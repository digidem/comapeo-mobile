import * as React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Field} from '@comapeo/schema';
import {
  useDraftObservationActions,
  useDraftObservationState,
} from '../../contexts/DraftObservationContext';

export const TextArea = React.memo<{field: Field}>(({field}) => {
  const {updateTag} = useDraftObservationActions();
  const tags = useDraftObservationState(state => state.value?.tags);
  const value = tags ? tags[field.tagKey] : '';
  return (
    <TextInput
      testID="OBS.details-inp"
      value={typeof value === 'string' ? value : ''}
      onChangeText={newVal => updateTag(field.tagKey, newVal)}
      style={styles.textInput}
      underlineColorAndroid="transparent"
      multiline
      scrollEnabled={false}
      textContentType="none"
      autoFocus
    />
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
