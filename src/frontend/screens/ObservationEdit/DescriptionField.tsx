import React, {useEffect, useState} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';

import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {BLACK, BLUE_GREY, NEW_DARK_GREY} from '../../lib/styles';

const m = defineMessages({
  descriptionPlaceholder: {
    id: 'screens.ObservationEdit.ObservationEditView.descriptionPlaceholder',
    defaultMessage: 'What is happening here?',
    description: 'Placeholder for description/notes field',
  },
});

export const DescriptionField = () => {
  const {formatMessage: t} = useIntl();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const notes = usePersistedDraftObservation(store => store.value?.tags.notes);
  const {updateTags} = useDraftObservation();

  useEffect(() => {
    const keyboardHideUnsub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    const keyboardShowUnsub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );

    return () => {
      keyboardHideUnsub.remove();
      keyboardShowUnsub.remove();
    };
  }, []);

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
        onChangeText={newVal => {
          updateTags('notes', newVal);
        }}
        placeholder={keyboardVisible ? '' : t(m.descriptionPlaceholder)}
        placeholderTextColor={BLUE_GREY}
        underlineColorAndroid="transparent"
        multiline
        contextMenuHidden
        scrollEnabled={false}
        textContentType="none"
        testID="observationDescriptionField"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: '#FFF',
    top: -15,
    left: 35,
    padding: 5,
    zIndex: 50,
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Rubik',
    color: NEW_DARK_GREY,
  },

  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    marginHorizontal: 20,
    borderRadius: 4,
    fontSize: 20,
    padding: 16,
    color: BLACK,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
