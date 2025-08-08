import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  StyleSheet,
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet as RNStyleSheet,
} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import DeviceIcon from '../../images/Device.svg';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
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

  function setNameWithValidation(nameValue: string) {
    if (nameValue.length > 60) {
      setErrorTimeout();
      return;
    }
    setName(nameValue);
  }

  function handleAddNamePress() {
    const trimmedName = name.trim();
    if (trimmedName.length === 0 || trimmedName.length > 60) {
      setErrorTimeout();
      return;
    }

    navigation.navigate('Success', {deviceName: trimmedName});
  }
  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.contentContainer}
      dockContainerStyle={styles.dockContainer}
      dockContent={
        <PrimaryButton
          testID="ONBOARDING.add-name-btn"
          fullSize
          onPress={handleAddNamePress}
          text={t(m.addName)}
        />
      }>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.headerAndForm}>
          <View style={styles.headerArea}>
            <DeviceIcon width={51} height={80} />
            <HeaderText
              variant="header1"
              style={styles.title}
              numberOfLines={2}>
              {t(m.header)}
            </HeaderText>
          </View>
          <View style={styles.form}>
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
      </TouchableWithoutFeedback>
    </ScreenContentWithDock>
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
  contentContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  dockContainer: {
    paddingBottom: 30,
  },
  headerAndForm: {
    width: '100%',
    gap: 30,
  },
  headerArea: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  form: {
    alignSelf: 'center',
    gap: 10,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 16,
    color: BLACK,
    fontSize: 16,
  },
  counterText: {
    alignSelf: 'flex-end',
    lineHeight: 16,
  },
  infoBox: {
    backgroundColor: VERY_LIGHT_GREY,
    borderColor: BLUE_GREY,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    fontSize: 20,
  },
  infoText: {
    textAlign: 'center',
    lineHeight: 16,
  },
});
