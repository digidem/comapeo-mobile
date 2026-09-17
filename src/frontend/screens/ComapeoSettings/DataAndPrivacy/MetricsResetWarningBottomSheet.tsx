import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {BottomSheetWrapper} from '../../../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {SecondaryButton} from '../../../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../../../sharedTypes/navigation';
import {BLUE_GREY, GREEN} from '../../../lib/styles';
import DiagnosticsSharingIcon from '../../../images/DiagnosticsSharing.svg';
import AppUsageSharingIcon from '../../../images/AppUsageSharing.svg';

const m = defineMessages({
  sharingOn: {
    id: 'screens.MetricsResetWarning.sharingOn',
    defaultMessage: 'Sharing will turn ON.',
  },
  sharingOff: {
    id: 'screens.MetricsResetWarning.sharingOff',
    defaultMessage: 'Sharing will turn OFF.',
  },
  desc: {
    id: 'screens.MetricsResetWarning.desc',
    defaultMessage: 'This will only go into effect when CoMapeo resets.',
  },
  done: {
    id: 'screens.MetricsResetWarning.done',
    defaultMessage: 'Done',
  },
});

export const MetricsResetWarningBottomSheet = ({
  navigation,
  route,
}: NativeRootNavigationProps<'MetricsResetWarning'>) => {
  const {formatMessage} = useIntl();
  const {metric, sharing} = route.params;

  const Icon =
    metric === 'diagnostics' ? DiagnosticsSharingIcon : AppUsageSharingIcon;

  return (
    <BottomSheetWrapper>
      <View style={styles.container} testID="MRW.sheet">
        <View style={styles.headerBlock}>
          <Icon
            width={80}
            height={80}
            color={sharing === 'on' ? GREEN : BLUE_GREY}
          />
          <HeaderText variant="header2" style={styles.centerText}>
            {formatMessage(sharing === 'on' ? m.sharingOn : m.sharingOff)}
          </HeaderText>
          <BodyText style={styles.centerText}>{formatMessage(m.desc)}</BodyText>
        </View>

        <SecondaryButton
          fullSize
          testID="MRW.done-btn"
          text={formatMessage(m.done)}
          renderIcon={({size, color}) => (
            <MaterialIcons
              name="check-circle-outline"
              size={size}
              color={color}
            />
          )}
          onPress={() => navigation.goBack()}
        />
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 24,
  },
  headerBlock: {
    alignItems: 'center',
    gap: 10,
  },
  centerText: {textAlign: 'center'},
});
