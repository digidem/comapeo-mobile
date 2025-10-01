import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import SuccessIcon from '../../images/Success.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {defineMessages, useIntl} from 'react-intl';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';

const m = defineMessages({
  success: {
    id: 'screens.DeviceNaming.Success.success',
    defaultMessage: 'Success!',
  },
  deviceReady: {
    id: 'screens.DeviceNaming.Success.deviceReady',
    defaultMessage: '{deviceName} is ready!',
  },
  chooseProject: {
    id: 'screens.DeviceNaming.Success.chooseProject',
    defaultMessage: 'Choose from below to start your first project.',
  },
  joinProject: {
    id: 'screens.DeviceNaming.Success.joinProject',
    defaultMessage: 'Join a Project',
  },
  mapOnYourOwn: {
    id: 'screens.DeviceNaming.Success.mapOnYourOwn',
    defaultMessage: 'Map On Your Own',
  },
});

export const Success = ({
  route,
  navigation,
}: NativeStackScreenProps<OnboardingParamsList, 'Success'>) => {
  const deviceName = route.params.deviceName;
  const {formatMessage: t} = useIntl();

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <SuccessIcon />
          <HeaderText style={styles.text}>
            {t(m.deviceReady, {deviceName})}
          </HeaderText>
          <BodyText style={{marginTop: 20}}>{t(m.chooseProject)}</BodyText>
        </View>
        <View style={{width: '100%', gap: 10}}>
          <PrimaryButton
            testID="ONBOARDING.join-project-btn"
            fullSize
            style={{marginTop: 20}}
            text={t(m.joinProject)}
            onPress={() => {
              navigation.navigate('JoinProjectIntro');
            }}
          />
          <SecondaryButton
            testID="ONBOARDING.map-on-your-own-btn"
            fullSize
            text={t(m.mapOnYourOwn)}
            onPress={() => {
              navigation.navigate('MapOnYourOwnIntro');
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  text: {
    marginTop: 20,
  },
});
