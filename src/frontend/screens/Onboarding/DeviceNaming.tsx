import * as React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet as RNStyleSheet,
} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import Ionicons from '@react-native-vector-icons/ionicons';
import {deviceType} from 'expo-device';
import DeviceIcon from '../../images/Device.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {
  BLACK,
  BLUE_GREY,
  LIGHT_GREY,
  NEW_DARK_GREY,
  RED,
  VERY_LIGHT_GREY,
} from '../../lib/styles';
import {useSetOwnDeviceInfo} from '@comapeo/core-react';
import {expoToCoreDeviceType} from '../../lib/deviceTypeMap';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';
import RNRestart from 'react-native-restart';

const m = defineMessages({
  header: {
    id: '$1screens.DeviceNaming.header',
    defaultMessage: 'Name Your Device',
  },
  description: {
    id: '$1screens.DeviceNaming.description',
    defaultMessage:
      'Distinct names help collaborators using CoMapeo to recognize you.',
  },
  save: {
    id: '$1screens.DeviceNaming.save',
    defaultMessage: 'Save',
  },
  placeholder: {
    id: '$1screens.DeviceNaming.placeholder',
    defaultMessage: 'Device Name',
  },
});

export const DeviceNaming = () => {
  const [name, setName] = React.useState('');
  const [errorTimeout, setErrorTimeout] = useTemporaryError();
  const {formatMessage: t} = useIntl();
  const {mutate, status} = useSetOwnDeviceInfo();

  function setNameWithValidation(nameValue: string) {
    if (nameValue.length > 60) {
      setErrorTimeout();
      return;
    }
    setName(nameValue);
  }

  function handleSavePress() {
    const trimmedName = name.trim();
    if (trimmedName.length === 0 || trimmedName.length > 60) {
      setErrorTimeout();
      return;
    }

    mutate(
      {
        name: trimmedName,
        deviceType: expoToCoreDeviceType(deviceType),
      },
      {
        onSuccess: () => {
          // Always restart the app here
          // If the user has toggled off diagnosticEnabled in `OnboardingPrivacyPolicy`
          // the app need to restart for sending diagnostic to be disabled in the backend.
          // This guarantees that app restart, while still navigating the user to the
          // `Success` screen after it has restart - as the navigation sets
          // the default screen to the success screen when the user has a name set
          RNRestart.restart();
        },
      },
    );
  }

  return (
    <KeyboardAvoidingView style={{width: '100%', height: '100%'}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.headerArea}>
            <DeviceIcon width={39} height={60} />
            <HeaderText variant="header2" style={styles.title}>
              {t(m.header)}
            </HeaderText>
            <View style={styles.nameForm}>
              <TextInput
                testID="ONBOARDING.device-name-inp"
                style={[
                  styles.textInput,
                  {borderColor: errorTimeout ? RED : LIGHT_GREY},
                ]}
                value={name}
                onChangeText={setNameWithValidation}
                placeholderTextColor={LIGHT_GREY}
                placeholder={t(m.placeholder)}
              />
              <BodyText
                variant="smallMeta"
                style={RNStyleSheet.flatten([
                  styles.counterText,
                  {color: errorTimeout ? RED : NEW_DARK_GREY},
                ])}>
                {`${name.length}/60`}
              </BodyText>
              <View style={styles.infoBox}>
                <BodyText variant="smallMeta" style={styles.infoText}>
                  {t(m.description)}
                </BodyText>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {status === 'pending' ? (
              <LoadingIndicator size="large" style={{flex: 0}} />
            ) : (
              <PrimaryButton
                testID="ONBOARDING.add-name-btn"
                fullSize
                onPress={handleSavePress}
                text={t(m.save)}
                renderIcon={({color, size}) => (
                  <Ionicons
                    name="checkmark-circle-outline"
                    color={color}
                    size={size}
                  />
                )}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

function useTemporaryError() {
  const [errorTimeout, setErrorTimeout] = React.useState(false);
  const timer = React.useRef<NodeJS.Timeout | undefined>(undefined);

  React.useEffect(() => {
    if (errorTimeout && !timer.current) {
      timer.current = setTimeout(() => {
        setErrorTimeout(false);
        timer.current = undefined;
      }, 1500);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = undefined;
      }
    };
  }, [errorTimeout]);

  return [
    errorTimeout,
    () => setErrorTimeout(prevVal => (!prevVal ? true : prevVal)),
  ] as const;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerArea: {
    alignItems: 'center',
    gap: 10,
    width: 280,
  },
  title: {
    textAlign: 'center',
  },
  nameForm: {
    gap: 10,
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 4,
    color: BLACK,
    fontSize: 16,
    paddingHorizontal: 16,
  },
  counterText: {
    alignSelf: 'flex-end',
  },
  infoBox: {
    backgroundColor: VERY_LIGHT_GREY,
    borderColor: BLUE_GREY,
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  infoText: {
    textAlign: 'center',
  },
  buttonContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
