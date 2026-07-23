import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {LoadingIndicator} from '../../../../sharedComponents/LoadingIndicator';

import {RED} from '../../../../lib/styles';
import ErrorIcon from '../../../../images/Error.svg';
import {useSecurityActions} from '../../../../contexts/SecurityStoreContext';
import {BottomSheetWrapper} from '../../../../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import {toError} from '../../../../utils/errors';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../../../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../../../../sharedTypes/navigation';

const m = defineMessages({
  turnOffConfirmation: {
    id: 'screens.AppPasscode.TurnOffPasscode.turnOffConfirmation',
    defaultMessage: 'Turn Off App Passcode?',
  },
  turnOff: {
    id: 'screens.AppPasscode.TurnOffPasscode.turnOff',
    defaultMessage: 'Turn Off',
  },
  cancel: {
    id: 'screens.AppPasscode.TurnOffPasscode.cancel',
    defaultMessage: 'Cancel',
  },
});

export const TurnOffPasscodeBottomSheet = ({
  navigation,
}: NativeRootNavigationProps<'TurnOffPasscodeBottomSheet'>) => {
  const {formatMessage: t} = useIntl();
  const {setPasscode} = useSecurityActions();
  const [isLoading, setIsLoading] = React.useState(false);

  function unsetAppPasscode() {
    setIsLoading(true);
    setPasscode(null)
      .then(() => {
        setIsLoading(false);
        navigation.pop(4);
      })
      .catch(err => {
        setIsLoading(false);
        navigation.navigate('ErrorBottomSheet', {
          error: toError(err, 'Failed to turn off passcode'),
        });
      });
  }

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={styles.icon}>
          <ErrorIcon width={60} height={60} color={RED} />
        </View>

        <HeaderText variant="header2" style={styles.title}>
          {t(m.turnOffConfirmation)}
        </HeaderText>

        {isLoading ? (
          <LoadingIndicator size="large" />
        ) : (
          <View style={styles.buttonsContainer}>
            <DestructiveButton
              fullSize
              text={t(m.turnOff)}
              onPress={unsetAppPasscode}
            />
            <SecondaryButton
              fullSize
              text={t(m.cancel)}
              onPress={() => navigation.goBack()}
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
  },
  icon: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    paddingBottom: 40,
  },
  buttonsContainer: {
    gap: 16,
    alignItems: 'center',
  },
});
