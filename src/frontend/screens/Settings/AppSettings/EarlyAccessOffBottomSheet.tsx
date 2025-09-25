import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {BottomSheetWrapper} from '../../../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {SecondaryButton} from '../../../sharedComponents/Buttons';
import type {NativeRootNavigationProps} from '../../../sharedTypes/navigation';

const m = defineMessages({
  title: {
    id: 'screens.EarlyAccessTurnedOff.title',
    defaultMessage: 'Early Access Data',
  },
  desc: {
    id: 'screens.EarlyAccessTurnedOff.desc',
    defaultMessage:
      'Data from Early Access will be hidden after switching off, but is still saved. Switch back anytime to see it.',
  },
  close: {
    id: 'screens.EarlyAccessTurnedOff.close',
    defaultMessage: 'Close',
  },
});

export const EarlyAccessOffBottomSheet = ({
  navigation,
}: NativeRootNavigationProps<'EarlyAccessOff'>) => {
  const {formatMessage} = useIntl();

  return (
    <BottomSheetWrapper>
      <View style={styles.container} testID="EA.turned-off-sheet">
        <View style={styles.headerBlock}>
          <HeaderText variant="header2" style={styles.centerText}>
            {formatMessage(m.title)}
          </HeaderText>
          <BodyText style={styles.centerText}>{formatMessage(m.desc)}</BodyText>
        </View>

        <SecondaryButton
          fullSize
          text={formatMessage(m.close)}
          onPress={() => navigation.goBack()}
        />
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
  },
  headerBlock: {
    alignItems: 'center',
    gap: 10,
  },
  centerText: {textAlign: 'center'},
});
