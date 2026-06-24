import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

import {useQADeviceNameActions} from '../contexts/QADeviceNameStoreContext';
import {LIGHT_GREY, RED, DARK_GREY} from '../lib/styles';
import {PrimaryButton} from '../sharedComponents/Buttons';
import {ScreenContentWithDock} from '../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BodyText} from '../sharedComponents/Text/BodyText';

export function SetQADeviceNameScreen() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const {setQADeviceName} = useQADeviceNameActions();

  const hasError = submitted && name.trim().length === 0;

  function handleSave() {
    setSubmitted(true);
    if (name.trim().length === 0) return;
    setQADeviceName(name.trim());
  }

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.content}
      dockContent={
        <PrimaryButton fullSize text="Save Name" onPress={handleSave} />
      }>
      <View style={styles.section}>
        <HeaderText variant="header2">Set QA Device Name</HeaderText>
        <BodyText style={styles.description}>
          This name is used to tag error reports in Sentry so developers can
          find issues reported from your specific device. Please write down this
          name and share it with the development team when reporting bugs.
        </BodyText>
      </View>

      <View style={styles.field}>
        <HeaderText variant="header3">QA Device Name (required)</HeaderText>
        <TextInput
          testID="SET_QA_DEVICE_NAME.name-input"
          style={[styles.input, hasError && styles.inputError]}
          value={name}
          onChangeText={setName}
          placeholder="e.g. cindy-pixel-7"
          placeholderTextColor={LIGHT_GREY}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {hasError && (
          <BodyText style={styles.errorText}>
            Please enter a name before saving.
          </BodyText>
        )}
      </View>
    </ScreenContentWithDock>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  description: {
    color: DARK_GREY,
    lineHeight: 22,
  },
  field: {
    gap: 10,
  },
  input: {
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 18,
    color: DARK_GREY,
  },
  inputError: {
    borderColor: RED,
  },
  errorText: {
    color: RED,
  },
});
