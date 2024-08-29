import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {BLACK, BLUE_GREY, NEW_DARK_GREY} from '../../lib/styles';
import {useKeyboardListener} from '../../hooks/useKeyboardListener';

const m = defineMessages({
  descriptionPlaceholder: {
    id: 'screens.ObservationEdit.ObservationEditView.descriptionPlaceholder',
    defaultMessage: 'What is happening here?',
    description: 'Placeholder for description/notes field',
  },
});

export const DescriptionField = ({
  notes,
  updateNotes,
}: {
  notes?: string;
  updateNotes?: (newNotes: string) => void;
}) => {
  const {formatMessage: t} = useIntl();
  const {keyboardVisible} = useKeyboardListener();

  return (
    <View style={styles.container}>
      {keyboardVisible && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{t(m.descriptionPlaceholder)}</Text>
        </View>
      )}
      <TextInput
        style={styles.textInput}
        value={!notes || typeof notes !== 'string' ? '' : notes}
        onChangeText={updateNotes}
        multiline
        placeholder={keyboardVisible ? '' : t(m.descriptionPlaceholder)}
        placeholderTextColor={BLUE_GREY}
        testID="OBS.description-inp"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    position: 'relative',
    marginTop: 20,
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: '#FFF',
    top: -15,
    left: 35,
    padding: 5,
    zIndex: 5,
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Rubik',
    color: NEW_DARK_GREY,
  },

  textInput: {
    minHeight: 56,
    flex: 1,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    padding: 10,
    borderRadius: 4,
    fontSize: 20,
    color: BLACK,
  },
});
