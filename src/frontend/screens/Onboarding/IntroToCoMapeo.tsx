import * as React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import TopoBackground from '../../images/TopoLogo.svg';
import CoMapeoTextAsSVG from '../../images/CoMapeoText.svg';
import WorldMap from '../../images/WorldMap.svg';
import HandshakeMediumMediumDark from '../../images/HandshakeMediumMediumDark.svg';
import LockedWithKey from '../../images/LockedWithKey.svg';
import RaisedFistMediumSkinTone from '../../images/RaisedFistMediumSkinTone.svg';
import {COMAPEO_DARK_BLUE, WHITE} from '../../lib/styles';
import {defineMessages, useIntl} from 'react-intl';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton} from '../../sharedComponents/Buttons';

const m = defineMessages({
  getStarted: {
    id: 'screens.IntroToCoMapeo.getStarted',
    defaultMessage: 'Get Started',
  },
  mapWorldTogether: {
    id: 'screens.IntroToCoMapeo.mapWorldTogether',
    defaultMessage: 'Map your world, together',
  },
  mapAnywhere: {
    id: 'screens.IntroToCoMapeo.mapAnywhere',
    defaultMessage: 'Map anywhere and everywhere',
  },
  collaborate: {
    id: 'screens.IntroToCoMapeo.collaborate',
    defaultMessage: 'Join or create project teams',
  },
  ownData: {
    id: 'screens.IntroToCoMapeo.ownData',
    defaultMessage: 'Own and control your data',
  },
  designedFor: {
    id: 'screens.IntroToCoMapeo.designedFor',
    defaultMessage:
      'Designed with and for Indigenous territory monitors & mappers',
  },
});

export const IntroToCoMapeo = ({
  navigation,
}: NativeStackScreenProps<OnboardingParamsList, 'IntroToCoMapeo'>) => {
  const {formatMessage} = useIntl();

  return (
    <View style={styles.container}>
      <TopoBackground style={styles.background} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CoMapeoTextAsSVG width={'95%'} height={48} style={styles.logo} />
        <View style={styles.mainTextContainer}>
          <HeaderText variant="header3" style={styles.mainText}>
            {formatMessage(m.mapWorldTogether)}
          </HeaderText>
        </View>
        <View style={styles.textBox}>
          <View style={styles.textItem}>
            <WorldMap width={24} height={24} />
            <BodyText variant="smallMeta" style={styles.text}>
              {formatMessage(m.mapAnywhere)}
            </BodyText>
          </View>
          <View style={styles.textItem}>
            <HandshakeMediumMediumDark width={24} height={24} />
            <BodyText variant="smallMeta" style={styles.text}>
              {formatMessage(m.collaborate)}
            </BodyText>
          </View>
          <View style={styles.textItem}>
            <LockedWithKey width={24} height={24} />
            <BodyText variant="smallMeta" style={styles.text}>
              {formatMessage(m.ownData)}
            </BodyText>
          </View>
          <View style={styles.textItem}>
            <RaisedFistMediumSkinTone width={24} height={24} />
            <BodyText variant="smallMeta" style={styles.text}>
              {formatMessage(m.designedFor)}
            </BodyText>
          </View>
        </View>
        <PrimaryButton
          testID="ONBOARDING.get-started-btn"
          fullSize
          onPress={() => {
            navigation.navigate('DataPrivacy');
          }}
          style={styles.getStartedButton}
          text={formatMessage(m.getStarted)}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COMAPEO_DARK_BLUE,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    marginBottom: 16,
  },
  mainTextContainer: {
    width: '75%',
    paddingBottom: 16,
  },
  mainText: {
    color: WHITE,
    textAlign: 'center',
  },
  textBox: {
    width: '95%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: WHITE,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 16,
  },
  textItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 16,
  },
  text: {
    color: WHITE,
    textAlign: 'left',
    flexShrink: 1,
    flex: 1,
  },
  getStartedButton: {
    marginTop: 16,
  },
});
