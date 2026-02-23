import * as React from 'react';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {useSecurityActions} from '../../contexts/SecurityStoreContext';
import ErrorIcon from '../../images/Error.svg';
import {RED} from '../../lib/styles';
import {useIntl, defineMessages} from 'react-intl';
import {UIActivityIndicator} from 'react-native-indicators';
import {StyleSheet, View} from 'react-native';
import * as Sentry from '@sentry/react-native';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {toError} from '../../utils/errors';

const m = defineMessages({
  title: {
    id: 'screens.AppPasscode.ConfirmPasscodeSheet.title',
    defaultMessage:
      'App Passcodes can never be recovered if lost or forgotten!',
  },
  suggestion: {
    id: 'screens.AppPasscode.ConfirmPasscodeSheet.suggestion',
    defaultMessage:
      'Make sure to note your passcode in a secure location before saving.',
  },
  cancel: {
    id: 'screens.AppPasscode.ConfirmPasscodeSheet.cancel',
    defaultMessage: 'Cancel',
  },
  saveAppPasscode: {
    id: 'screens.AppPasscode.ConfirmPasscodeSheet.saveAppPasscode',
    defaultMessage: 'Save App Passcode',
  },
  passcode: {
    id: 'screens.AppPasscode.ConfirmPasscodeSheet.passcode',
    defaultMessage: 'Passcode: {passcode}',
    description: 'used to indicate to the user what the new passcode will be.',
  },
});

export const ConfirmPasscodeBottomSheet = ({
  route,
}: {
  route: {params: {passcode: string}};
}) => {
  const {formatMessage: t} = useIntl();
  const {setPasscode} = useSecurityActions();
  const navigation = useNavigationFromRoot();
  const [loading, setLoading] = React.useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await setPasscode(route.params.passcode);
      navigation.popTo('Security');
    } catch (e) {
      Sentry.captureException(e);
      navigation.navigate('ErrorBottomSheet', {
        error: toError(e, 'Error setting passcode'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={styles.icon}>
          {<ErrorIcon width={60} height={60} color={RED} />}
        </View>

        <HeaderText variant="header2" style={styles.title}>
          {t(m.title)}
        </HeaderText>

        <BodyText variant="large" style={styles.description}>
          {t(m.suggestion)}
          {'\n\n'}
          {t(m.passcode, {passcode: route.params.passcode})}
        </BodyText>
        {loading ? (
          <View style={styles.loading}>
            <UIActivityIndicator size={32} />
          </View>
        ) : (
          <View style={styles.buttonsContainer}>
            <SecondaryButton
              testID="PASSCODE:cancel-btn"
              fullSize
              text={t(m.cancel)}
              onPress={() => navigation.popTo('Security')}
            />
            <PrimaryButton
              fullSize
              text={t(m.saveAppPasscode)}
              onPress={handleSave}
            />
          </View>
        )}
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    minHeight: 400,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
    alignItems: 'center',
  },
  loading: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
