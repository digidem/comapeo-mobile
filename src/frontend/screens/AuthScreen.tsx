import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useWindowDimensions} from 'react-native';
import {LoadingIndicator} from '../sharedComponents/LoadingIndicator';

import {useAuthContext} from '../contexts/AuthContext';
import CoMapeoLogoSvg from '../images/CoMapeoLogo.svg';
import ClockIcon from '../images/ClockOutlined.svg';
import {RED, BLACK} from '../lib/styles';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {PasscodeInput} from '../sharedComponents/PasscodeInput';
import {ScreenContentWithDock} from '../sharedComponents/ScreenContentWithDock';
import {usePasscodeLockout} from '../hooks/usePasscodeLockout';
import {useSecurityState} from '../contexts/SecurityStoreContext';

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

export const AuthScreen = () => {
  const {formatMessage: t} = useIntl();
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const {authenticate} = useAuthContext();
  const lockUntil = useSecurityState(store => store.lockUntil);
  const [inputtedPass, setInputtedPass] = React.useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);
  const lockedOutMinutes = usePasscodeLockout({
    lockUntil,
    clearError: () => setError(false),
  });

  if (error) {
    if (inputtedPass.length === 5) setInputtedPass('');
  }

  function setInputWithValidation(passValue: string) {
    if (error) setError(false);
    setInputtedPass(passValue);
    if (passValue.length === 5) {
      validatePass(passValue);
    }
  }

  async function validatePass(passValue: string) {
    setLoading(true);
    try {
      await authenticate(passValue);
    } catch {
      scrollViewRef.current?.scrollToEnd();
      setError(true);
    } finally {
      setLoading(false);
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
        error && <BodyText style={styles.wrongPass}>{t(m.wrongPass)}</BodyText>
      }>
      {/* Hide SVG logo in E2E mode to reduce rendering lag on BrowserStack */}
      {process.env.EXPO_PUBLIC_E2E_TEST !== 'true' && (
        <CoMapeoLogoSvg style={{height: window.height / 3, aspectRatio: 1}} />
      )}
      {lockedOutMinutes > 0 ? (
        <View style={styles.lockoutContainer}>
          <ClockIcon width={20} height={20} />
          <BodyText style={styles.lockoutText}>
            {t(m.lockoutMessage, {minutes: lockedOutMinutes})}
          </BodyText>
        </View>
      ) : (
        <BodyText>{t(m.enterPass)}</BodyText>
      )}
      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingIndicator size="large" />
        </View>
      ) : (
        <PasscodeInput
          testID="SETTINGS.auth-passcode-inp"
          error={error}
          inputValue={inputtedPass}
          onChangeTextWithValidation={setInputWithValidation}
          editable={lockedOutMinutes <= 0}
        />
      )}
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    gap: 20,
    alignItems: 'center',
  },
  wrongPass: {
    color: RED,
    textAlign: 'center',
  },
  lockoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockoutText: {
    color: BLACK,
  },
  loadingContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
