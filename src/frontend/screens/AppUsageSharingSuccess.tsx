import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import SuccessIcon from '../../images/Success.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {defineMessages, useIntl} from 'react-intl';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {NEW_DARK_GREY} from '../lib/styles';
import {AppStackParamsList} from '../sharedTypes/navigation';
import {SecondaryButton} from '../sharedComponents/Buttons';
import {ScreenContentWithDock} from '../sharedComponents/ScreenContentWithDock';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {
  useAppUsageStatsPromptActions,
  useAppUsageStatsPromptState,
} from '../contexts/AppUsageStatsPromptContext';
import {shouldShowAppUsagePrompt} from '../lib/shouldShowAppUsagePrompt';

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

export const AppUsageSharingSuccess = ({
  navigation,
}: NativeStackScreenProps<AppStackParamsList, 'AppUsageSharingSuccess'>) => {
  const {formatMessage} = useIntl();
  const {data} = useOwnDeviceInfo();
  const deviceName = data?.name;
  const {setOptedIn} = useAppUsageStatsPromptActions();
  const showPrompt = shouldShowAppUsagePrompt(
    useAppUsageStatsPromptState(s => s),
  );

  React.useEffect(() => {
    if (!showPrompt) {
      navigation.replace('Home', {screen: 'Map'});
    }
  }, [showPrompt, navigation]);

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
        <HeaderText variant="header5" style={styles.centerText}>
          {deviceName}
        </HeaderText>
        <BodyText style={{...styles.centerText, color: NEW_DARK_GREY}}>
          {formatMessage(m.nowSharing)}
        </BodyText>
        <BodyText style={{...styles.centerText, color: NEW_DARK_GREY}}>
          {formatMessage(m.removeAnytime)}
        </BodyText>
      </View>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  centerText: {textAlign: 'center', marginTop: 20},
});
