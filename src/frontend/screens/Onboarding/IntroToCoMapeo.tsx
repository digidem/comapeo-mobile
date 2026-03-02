import * as React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import TopoBackground from '../../images/TopoLogo.svg';
import CoMapeoTextAsSVG from '../../images/CoMapeoText.svg';
import WorldMap from '../../images/WorldMap.svg';
import Handshake from '../../images/Handshake.svg';
import LockedWithKey from '../../images/LockedWithKey.svg';
import {COMAPEO_DARK_BLUE, WHITE} from '../../lib/styles';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingParamsList} from '../../sharedTypes/navigation';

const m = defineMessages({
  getStarted: {
    id: 'screens.IntroToCoMapeo.getStarted',
    defaultMessage: 'Get Started',
  },
  mapWorldTogether: {
    id: 'screens.IntroToCoMapeo.mapWorldTogether',
    defaultMessage: 'Map your world, together.',
  },
  mapAnywhere: {
    id: 'screens.IntroToCoMapeo.mapAnywhere',
    defaultMessage: 'Map anywhere and everywhere',
  },
  collaborate: {
    id: 'screens.IntroToCoMapeo.collaborate',
    defaultMessage: 'Securely share with collaborators',
  },
  ownData: {
    id: 'screens.IntroToCoMapeo.ownData',
    defaultMessage: 'Always own and control your data',
  },
  designedFor: {
    id: 'screens.IntroToCoMapeo.designedFor',
    defaultMessage:
      'Co-designed with and for Indigenous territory mappers & monitors.',
  },
});
// primary-string ENTIRE SCREEN
export const IntroToCoMapeo = ({
  navigation,
}: NativeStackScreenProps<OnboardingParamsList, 'IntroToCoMapeo'>) => {
  const {formatMessage} = useIntl();

  return (
    <View style={styles.container}>
      <TopoBackground style={styles.background} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <CoMapeoTextAsSVG width={290} height={60} />
          <HeaderText variant="header3" style={styles.mainText}>
            {formatMessage(m.mapWorldTogether)}
          </HeaderText>
        </View>
        <View style={styles.textBox}>
          <View style={styles.textItem}>
            <WorldMap width={26} height={26} />
            <BodyText variant="smallMeta" style={styles.text}>
              {formatMessage(m.mapAnywhere)}
            </BodyText>
          </View>
          <View style={styles.textItem}>
            <Handshake width={26} height={26} />
            <BodyText variant="smallMeta" style={styles.text}>
              {formatMessage(m.collaborate)}
            </BodyText>
          </View>
          <View style={styles.textItem}>
            <LockedWithKey width={26} height={26} />
            <BodyText variant="smallMeta" style={styles.text}>
              {formatMessage(m.ownData)}
            </BodyText>
          </View>
        </View>
        <View style={styles.designedForContainer}>
          <BodyText variant="smallMeta" style={styles.designedForText}>
            {formatMessage(m.designedFor)}
          </BodyText>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          testID="ONBOARDING.get-started-btn"
          fullSize
          text={formatMessage(m.getStarted)}
          onPress={() => {
            navigation.replace('DataPrivacy');
          }}
          iconPosition="right"
          renderIcon={({color, size}) => (
            <Ionicons
              name="arrow-forward-circle-outline"
              color={color}
              size={size}
            />
          )}
        />
      </View>
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
    gap: 20,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 10,
  },
  mainText: {
    color: WHITE,
    fontSize: 24,
    textAlign: 'center',
  },
  textBox: {
    width: '95%',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: WHITE,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 51, 0.5)',
    gap: 12,
    marginBottom: 16,
  },
  textItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    color: WHITE,
    textAlign: 'left',
    flexShrink: 1,
    flex: 1,
  },
  designedForContainer: {
    width: '85%',
    marginTop: 16,
    alignItems: 'center',
  },
  designedForText: {
    color: WHITE,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
