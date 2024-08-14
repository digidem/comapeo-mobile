import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useSecurityContext} from '../contexts/SecurityContext';
import CoMapeoLogoSvg from '../images/CoMapeoLogo.svg';
import {RED} from '../lib/styles';
import {PasscodeInput} from '../sharedComponents/PasscodeInput';
import {ScreenContentWithDock} from '../sharedComponents/ScreenContentWithDock';
import {AppStackParamsList} from '../sharedTypes/navigation';
import {useWindowDimensions} from 'react-native';

const m = defineMessages({
  enterPass: {
    id: 'screens.EnterPassword.enterPass',
    defaultMessage: 'Enter your passcode',
  },
  wrongPass: {
    id: 'screens.EnterPassword.wrongPass',
    defaultMessage: 'Incorrect passcode, please try again ',
  },
});

export const AuthScreen = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'AuthScreen'>) => {
  const {formatMessage: t} = useIntl();
  const [error, setError] = React.useState(false);
  const {authenticate, authState} = useSecurityContext();
  const [inputtedPass, setInputtedPass] = React.useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    function disableBack(e: any) {
      if (authState !== 'unauthenticated') return;
      // Prevent back if unauthenticated
      e.preventDefault();
    }
    navigation.addListener('beforeRemove', disableBack);

    return () => {
      navigation.removeListener('beforeRemove', disableBack);
    };
  }, [authState, navigation]);

  React.useEffect(() => {
    if (authState === 'unauthenticated') return;

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home', {screen: 'Map'});
    }
  }, [authState, navigation]);

  if (error) {
    if (inputtedPass.length === 5) setInputtedPass('');
  }

  function setInputWithValidation(passValue: string) {
    if (error) {
      setError(false);
    }
    setInputtedPass(passValue);
    if (passValue.length === 5) {
      validatePass(passValue);
    }
  }

  function validatePass(passValue: string) {
    try {
      authenticate(passValue);
    } catch (err) {
      scrollViewRef.current?.scrollToEnd();
      setError(true);
    }
  }

  const {top} = useSafeAreaInsets();
  const window = useWindowDimensions();

  return (
    <ScreenContentWithDock
      contentContainerStyle={[
        styles.contentContainer,
        {paddingTop: top + 20, paddingBottom: 20},
      ]}
      dockContent={
        error && <Text style={styles.wrongPass}>{t(m.wrongPass)}</Text>
      }>
      <CoMapeoLogoSvg height={window.height / 3} />
      <Text style={styles.description}>{t(m.enterPass)}</Text>
      <PasscodeInput
        testID="SETTINGS.auth-passcode-inp"
        error={error}
        inputValue={inputtedPass}
        onChangeTextWithValidation={setInputWithValidation}
      />
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    gap: 20,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
  },
  wrongPass: {
    fontSize: 16,
    color: RED,
    textAlign: 'center',
  },
});
