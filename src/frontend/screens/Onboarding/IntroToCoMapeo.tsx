import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import ComapeoIntro from '../../images/ComapeoIntro.svg';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {LIGHT_BLUE} from '../../lib/styles';
import {useBottomPaddingWithSafeArea} from '../../hooks/useBottomPaddingWithSafeArea';

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
  const paddingBottom = useBottomPaddingWithSafeArea();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom,
        backgroundColor: LIGHT_BLUE,
      }}>
      <View style={styles.image}>
        <ComapeoIntro
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax meet"
        />
      </View>
      <HeaderText variant="header3" style={styles.mainText}>
        {formatMessage(m.mapWorldTogether)}
      </HeaderText>
      <PrimaryButton
        style={{alignSelf: 'center'}}
        testID="ONBOARDING.navigate-to-privacy-policy-btn"
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
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
  mainText: {
    fontSize: 24,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
});
