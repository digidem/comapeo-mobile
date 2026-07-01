import React, {useState} from 'react';
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

function QADeviceNameCommon({
  initialName,
  onSave,
  contentStyle,
}: {
  initialName: string;
  onSave: (name: string) => void;
  contentStyle?: object;
}) {
  const [name, setName] = useState(initialName);
  const [submitted, setSubmitted] = useState(false);

  const hasError = submitted && name.trim().length === 0;

  function handleSave() {
    setSubmitted(true);
    if (name.trim().length === 0) return;
    onSave(name.trim());
  }

  return (
    <ScreenContentWithDock
      contentContainerStyle={[styles.content, contentStyle]}
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

// Rendered outside NavigationContainer as a gate before the app loads only for QA builds.
export function SetQADeviceNameScreen() {
  const {setQADeviceName} = useQADeviceNameActions();

  function handleSave(name: string) {
    setQADeviceName(name);
    ToastAndroid.show('QA device name saved', ToastAndroid.SHORT);
  }

  return (
    <QADeviceNameCommon
      initialName=""
      onSave={handleSave}
      contentStyle={styles.gateContentOffset}
    />
  );
}

// Rendered inside NavigationContainer, accessible from Settings.
export function EditQADeviceNameScreen() {
  const currentName = useQADeviceName();
  const {setQADeviceName} = useQADeviceNameActions();
  const navigation = useNavigation();

  function handleSave(name: string) {
    setQADeviceName(name);
    ToastAndroid.show('QA device name saved', ToastAndroid.SHORT);
    navigation.goBack();
  }

  return (
    <QADeviceNameCommon initialName={currentName ?? ''} onSave={handleSave} />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
  gateContentOffset: {
    marginTop: 60,
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
    paddingHorizontal: 12,
    paddingVertical: 12,
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
