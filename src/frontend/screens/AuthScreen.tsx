import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useWindowDimensions} from 'react-native';

import {useAuthContext} from '../contexts/AuthContext';
import CoMapeoLogoSvg from '../images/CoMapeoLogo.svg';
import ClockIcon from '../images/ClockOutlined.svg';
import {RED, BLACK} from '../lib/styles';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {PasscodeInput} from '../sharedComponents/PasscodeInput';
import {ScreenContentWithDock} from '../sharedComponents/ScreenContentWithDock';
import {AppStackParamsList} from '../sharedTypes/navigation';
import {useSecurityState} from '../contexts/SecurityStoreContext';
import {getRemainingLockoutMinutes} from '../lib/security';

const m = defineMessages({
  enterPass: {
    id: 'screens.EnterPassword.enterPass',
    defaultMessage: 'Enter your passcode',
  },
  wrongPass: {
    id: 'screens.EnterPassword.wrongPass',
    defaultMessage: 'Incorrect Passcode ',
  },
  lockoutMessage: {
    id: 'screens.EnterPassword.lockoutMessage',
    defaultMessage:
      'Try again in {minutes, plural, one {# minute} other {# minutes}}',
  },
});

export const AuthScreen = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'AuthScreen'>) => {
  const {formatMessage: t} = useIntl();
  const [error, setError] = React.useState(false);
  const {authenticate, authState} = useAuthContext();
  const [inputtedPass, setInputtedPass] = React.useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [isLockedOut, setIsLockedOut] = React.useState(false);
  const [lockoutMessage, setLockoutMessage] = React.useState<string | null>(
    null,
  );
  const {lockUntil} = useSecurityState();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (authState !== 'unauthenticated') return;
      // Prevent back if unauthenticated
      event.preventDefault();
    });

    return () => {
      unsubscribe();
    };
  }, [authState, navigation]);

  React.useEffect(() => {
    if (!lockUntil) {
      setIsLockedOut(false);
      setLockoutMessage(null);
      return;
    }

    const minutes = getRemainingLockoutMinutes(lockUntil);

    if (minutes <= 0) {
      setIsLockedOut(false);
      setLockoutMessage(null);
      return;
    }
    setIsLockedOut(true);
    setLockoutMessage(t(m.lockoutMessage, {minutes}));

    const timeout = setTimeout(() => {
      setIsLockedOut(false);
      setLockoutMessage(null);
    }, minutes * 60000);

    return () => clearTimeout(timeout);
  }, [lockUntil, t]);

  React.useEffect(() => {
    if (authState === 'unauthenticated') return;

    if (authState === 'authenticated') {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.popTo('Home', {screen: 'Map'});
      }
    }

    if (authState === 'obscured') {
      navigation.popTo('Home', {screen: 'Map'});
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
    } catch (e) {
      scrollViewRef.current?.scrollToEnd();
      setError(true);
      if (e instanceof Error && e.message === 'LOCKED_OUT') {
        const minutes = getRemainingLockoutMinutes(lockUntil);
        setLockoutMessage(t(m.lockoutMessage, {minutes}));
      } else {
        setLockoutMessage(null);
      }
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
      {/* Hide SVG logo in E2E mode to reduce rendering lag on BrowserStack */}
      {process.env.EXPO_PUBLIC_E2E_TEST !== 'true' && (
        <CoMapeoLogoSvg height={window.height / 3} />
      )}
      {isLockedOut ? (
        <View style={styles.lockoutContainer}>
          <ClockIcon width={20} height={20} />
          <BodyText style={styles.lockoutText}>{lockoutMessage}</BodyText>
        </View>
      ) : (
        <Text style={styles.description}>{t(m.enterPass)}</Text>
      )}
      <PasscodeInput
        testID="SETTINGS.auth-passcode-inp"
        error={error}
        inputValue={inputtedPass}
        onChangeTextWithValidation={setInputWithValidation}
        editable={!isLockedOut}
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
  lockoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
    height: 24,
  },
  lockoutText: {
    color: BLACK,
    fontSize: 16,
  },
});
