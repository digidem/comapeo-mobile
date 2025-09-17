import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import SuccessIcon from '../images/Success.svg';
import {defineMessages, useIntl} from 'react-intl';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {NEW_DARK_GREY} from '../lib/styles';
import {SecondaryButton} from '../sharedComponents/Buttons';
import {ScreenContentWithDock} from '../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {useAppUsageStatsActions} from '../contexts/AppUsageStatsContext';

const m = defineMessages({
  success: {
    id: 'screens.AppUsageSharingSuccess.success',
    defaultMessage: 'Success!',
  },
  done: {
    id: 'screens.AppUsageSharingSuccess.done',
    defaultMessage: 'Done',
  },
  nowSharing: {
    id: 'screens.AppUsageSharingSuccess.nowSharing',
    defaultMessage: 'is now sharing how you use CoMapeo with Awana Digital.',
  },
  removeAnytime: {
    id: 'screens.AppUsageSharingSuccess.removeAnytime',
    defaultMessage:
      'Change this anytime by navigating to Data & Privacy in the Menu.',
  },
});

export const AppUsageSharingSuccess = () => {
  const {formatMessage} = useIntl();
  const {data} = useOwnDeviceInfo();
  const deviceName = data?.name;
  const {setOptedIn} = useAppUsageStatsActions();

  return (
    <ScreenContentWithDock
      dockContent={
        <SecondaryButton
          fullSize
          text={formatMessage(m.done)}
          onPress={() => {
            setOptedIn(true);
          }}
        />
      }
      contentContainerStyle={{marginTop: 80}}>
      <View style={{alignItems: 'center'}}>
        <SuccessIcon />
        <HeaderText variant="header1" style={styles.headerText}>
          {formatMessage(m.success)}
        </HeaderText>
        <HeaderText variant="header5" style={styles.headerText}>
          {deviceName}
        </HeaderText>
        <BodyText style={styles.bodyText}>
          {formatMessage(m.nowSharing)}
        </BodyText>
        <BodyText style={{...styles.bodyText, marginTop: 30}}>
          {formatMessage(m.removeAnytime)}
        </BodyText>
      </View>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  headerText: {textAlign: 'center', marginTop: 30},
  bodyText: {
    textAlign: 'center',
    color: NEW_DARK_GREY,
    paddingHorizontal: 40,
  },
});
