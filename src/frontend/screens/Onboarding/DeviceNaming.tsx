import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
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
import {OnboardingParamsList} from '../../sharedTypes/navigation';

const m = defineMessages({
  header: {
    id: 'screens.DeviceNaming.header',
    defaultMessage: 'Name Your Device',
  },
  description: {
    id: 'screens.DeviceNaming.description',
    defaultMessage:
      'Distinct, memorable names help collaborators using CoMapeo to recognize you.',
  },
  addName: {
    id: 'screens.DeviceNaming.addName',
    defaultMessage: 'Save',
  },
  placeholder: {
    id: 'screens.DeviceNaming.placeholder',
    defaultMessage: 'Device Name',
  },
});

export const DeviceNaming = ({
  navigation,
}: NativeStackScreenProps<OnboardingParamsList, 'DeviceNaming'>) => {
  const [name, setName] = React.useState('');
  const [errorTimeout, setErrorTimeout] = useTemporaryError();
  const {formatMessage: t} = useIntl();

  function setNameWithValidation(v: string) {
    if (v.length > 60) {
      setErrorTimeout();
      return;
    }
    setName(v);
  }

  function handleAddNamePress() {
    const trimmed = name.trim();
    if (trimmed.length === 0 || trimmed.length > 60) {
      setErrorTimeout();
      return;
    }
    navigation.navigate('Success', {deviceName: trimmed});
  }

  return (
    <KeyboardAvoidingView style={{width: '100%', height: '100%'}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.headerArea}>
            <DeviceIcon width={51} height={80} />
            <HeaderText
              variant="header1"
              style={styles.title}
              numberOfLines={2}>
              {t(m.header)}
            </HeaderText>
            <View style={styles.nameForm}>
              <TextInput
                testID="ONBOARDING.device-name-inp"
                style={[
                  styles.textInput,
                  {borderColor: errorTimeout ? RED : NEW_DARK_GREY},
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
                <BodyText variant="tinyMeta" style={styles.infoText}>
                  {t(m.description)}
                </BodyText>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <PrimaryButton
              testID="ONBOARDING.add-name-btn"
              fullSize
              onPress={handleAddNamePress}
              text={t(m.addName)}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

function useTemporaryError() {
  const [errorTimeout, setErrorTimeout] = React.useState(false);
  const timer = React.useRef<NodeJS.Timeout | undefined>();

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
    paddingTop: 80,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerArea: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 4,
    color: BLACK,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  counterText: {
    alignSelf: 'flex-end',
  },
  nameForm: {
    gap: 10,
  },
  infoBox: {
    backgroundColor: VERY_LIGHT_GREY,
    borderColor: BLUE_GREY,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  infoText: {
    textAlign: 'center',
  },
  buttonContainer: {
    paddingVertical: 20,
  },
});
