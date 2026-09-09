import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import ComapeoIntro from '../../images/ComapeoIntro.svg';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';

const m = defineMessages({
  start: {
    id: '$1screens.IntroToCoMapeo.start',
    defaultMessage: 'Start',
  },
  mapWorldTogether: {
    id: '$1screens.IntroToCoMapeo.mapWorldTogether',
    defaultMessage: 'Map your world, together.',
  },
});
export const IntroToCoMapeo = ({
  navigation,
}: NativeStackScreenProps<OnboardingParamsList, 'IntroToCoMapeo'>) => {
  const {formatMessage} = useIntl();

  return (
    <ScreenContentWithDock
      contentContainerStyle={{flex: 1, padding: 40}}
      dockContent={
        <PrimaryButton
          testID="ONBOARDING.get-started-btn"
          fullSize
          text={formatMessage(m.start)}
          onPress={() => {
            navigation.replace('DataPrivacy');
          }}
          iconPosition="left"
          renderIcon={({color, size}) => (
            <Ionicons
              name="arrow-forward-circle-outline"
              color={color}
              size={size}
            />
          )}
        />
      }>
      <View
        style={{
          alignItems: 'center',
          height: '100%',
          justifyContent: 'space-between',
        }}>
        <ComapeoIntro />
        <HeaderText variant="header3" style={styles.mainText}>
          {formatMessage(m.mapWorldTogether)}
        </HeaderText>
      </View>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  mainText: {
    fontSize: 24,
    textAlign: 'center',
  },
});
