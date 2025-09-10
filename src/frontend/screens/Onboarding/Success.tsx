import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import SuccessIcon from '../../images/Success.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {defineMessages, useIntl} from 'react-intl';
import {useSetOwnDeviceInfo} from '@comapeo/core-react';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {deviceType} from 'expo-device';
import {expoToCoreDeviceType} from '../../lib/deviceTypeMap';
import {useAppUsageStatsPromptActions} from '../../contexts/AppUsageStatsPromptContext';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {Loading} from '../../sharedComponents/Loading';
import {BLACK} from '../../lib/styles';

const m = defineMessages({
  success: {
    id: 'screens.DeviceNaming.Success.success',
    defaultMessage: 'Success!',
  },
  ready: {
    id: 'screens.DeviceNaming.Success.ready',
    defaultMessage: 'is now ready.',
  },
  next: {
    id: 'screens.DeviceNaming.Success.next',
    defaultMessage: 'Next',
  },
});

export const Success = ({
  route,
}: NativeStackScreenProps<OnboardingParamsList, 'Success'>) => {
  const {mutate, status} = useSetOwnDeviceInfo();
  const {recordCompleteOnboarding} = useAppUsageStatsPromptActions();
  const deviceName = route.params.deviceName;
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SuccessIcon />
        <HeaderText style={{color: BLACK}}>{t(m.success)}</HeaderText>
      </View>
      <View style={styles.textContainer}>
        <HeaderText variant="header5">{deviceName}</HeaderText>
        <BodyText>{t(m.ready)}</BodyText>
      </View>
      <View style={styles.buttonContainer}>
        {status === 'pending' ? (
          <Loading />
        ) : (
          <PrimaryButton
            testID="ONBOARDING.go-to-project-btn"
            fullSize
            onPress={() => {
              recordCompleteOnboarding();
              mutate({
                name: deviceName,
                deviceType: expoToCoreDeviceType(deviceType),
              });
            }}
            text={t(m.next)}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    justifyContent: 'space-between',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    gap: 20,
  },
  textContainer: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
});
