import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  useQADeviceName,
  useQADeviceNameActions,
} from '../contexts/QADeviceNameStoreContext';
import {LIGHT_GREY, RED, DARK_GREY, WHITE} from '../lib/styles';
import {PrimaryButton} from '../sharedComponents/Buttons';
import {ScreenContentWithDock} from '../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BodyText} from '../sharedComponents/Text/BodyText';

function QADeviceNameCommon({
  initialName,
  onSave,
}: {
  initialName: string;
  onSave: (name: string) => void;
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
    <KeyboardAvoidingView style={styles.keyboardAvoiding} behavior="height">
      <ScreenContentWithDock
        contentContainerStyle={styles.content}
        dockContent={
          <PrimaryButton fullSize text="Save Name" onPress={handleSave} />
        }>
        <View style={styles.section}>
          <HeaderText variant="header2">Set QA Device Name</HeaderText>
          <BodyText style={styles.description}>
            This name is used for the developers to be able to search through
            events in Sentry and identify the relevant device. Spaces are
            allowed and there is a maximum of 200 characters and no new lines.
          </BodyText>
          <BodyText style={styles.description}>
            Please make a note of the name you chose to be able to share with
            developers if needed.
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
    </KeyboardAvoidingView>
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
    <SafeAreaView style={styles.safeArea}>
      <QADeviceNameCommon initialName="" onSave={handleSave} />
    </SafeAreaView>
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
  keyboardAvoiding: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
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
