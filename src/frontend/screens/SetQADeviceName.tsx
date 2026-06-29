import React, {useLayoutEffect, useState} from 'react';
import {StyleSheet, TextInput, ToastAndroid, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {
  useQADeviceName,
  useQADeviceNameActions,
} from '../contexts/QADeviceNameStoreContext';
import {LIGHT_GREY, RED, DARK_GREY} from '../lib/styles';
import {PrimaryButton} from '../sharedComponents/Buttons';
import {ScreenContentWithDock} from '../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BodyText} from '../sharedComponents/Text/BodyText';

export function SetQADeviceNameScreen() {
  const currentName = useQADeviceName();
  const [name, setName] = useState(currentName ?? '');
  const [submitted, setSubmitted] = useState(false);
  const {setQADeviceName} = useQADeviceNameActions();
  const navigation = useNavigation();

  const isEditingExisting = currentName !== null;

  useLayoutEffect(() => {
    if (!isEditingExisting) {
      navigation.setOptions({headerLeft: () => null});
    }
  }, [navigation, isEditingExisting]);

  const hasError = submitted && name.trim().length === 0;

  function handleSave() {
    setSubmitted(true);
    if (name.trim().length === 0) return;
    setQADeviceName(name.trim());
    ToastAndroid.show('QA device name saved', ToastAndroid.SHORT);
    if (isEditingExisting) {
      navigation.goBack();
    }
  }

  return (
    <ScreenContentWithDock
      contentContainerStyle={{
        gap: 24,
        ...(!isEditingExisting && {marginTop: 24}),
      }}
      dockContent={
        <PrimaryButton fullSize text="Save Name" onPress={handleSave} />
      }>
      <View style={styles.section}>
        <HeaderText variant="header2">Set QA Device Name</HeaderText>
        <BodyText style={styles.description}>
          This name is used for the developers to be able to search through
          events in Sentry and identify the relevant device. Spaces are allowed
          and there is a maximum of 200 characters and no new lines.
        </BodyText>
      </View>

      <View style={styles.field}>
        <HeaderText variant="header3">QA Device Name (required)</HeaderText>
        <TextInput
          testID="SET_QA_DEVICE_NAME.name-input"
          style={[styles.input, hasError && styles.inputError]}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Motorola Moto G4"
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
