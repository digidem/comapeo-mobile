import * as React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import TopoBackground from '../../images/TopoLogo.svg';
import CoMapeoTextAsSVG from '../../images/CoMapeoText.svg';
import WorldMap from '../../images/WorldMap.svg';
import MobilePhoneWithArrow from '../../images/MobilePhoneWithArrow.svg';
import LockedWithKey from '../../images/LockedWithKey.svg';
import RaisedFistMediumSkinTone from '../../images/RaisedFistMediumSkinTone.svg';
import {COMAPEO_DARK_BLUE, WHITE} from '../../lib/styles';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../sharedComponents/Text';
import {Button} from '../../sharedComponents/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingParamsList} from '../../sharedTypes/navigation';

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
    defaultMessage: 'Collaborate with others',
  },
  ownData: {
    id: 'screens.IntroToCoMapeo.ownData',
    defaultMessage: 'Own and control your data',
  },
  designedFor: {
    id: 'screens.IntroToCoMapeo.designedFor',
    defaultMessage:
      'Designed with and for Indigenous peoples & frontline communities',
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
          <Text style={styles.mainText}>
            {formatMessage(m.mapWorldTogether)}
          </Text>
        </View>
        <View style={styles.textBox}>
          <View style={styles.textItem}>
            <WorldMap width={24} height={24} />
            <Text style={styles.text}>{formatMessage(m.mapAnywhere)}</Text>
          </View>
          <View style={styles.textItem}>
            <MobilePhoneWithArrow width={24} height={24} />
            <Text style={styles.text}>{formatMessage(m.collaborate)}</Text>
          </View>
          <View style={styles.textItem}>
            <LockedWithKey width={24} height={24} />
            <Text style={styles.text}>{formatMessage(m.ownData)}</Text>
          </View>
          <View style={styles.textItem}>
            <RaisedFistMediumSkinTone width={24} height={24} />
            <Text style={styles.text}>{formatMessage(m.designedFor)}</Text>
          </View>
        </View>
        <Button
          testID="ONBOARDING.get-started-btn"
          fullWidth
          onPress={() => {
            navigation.navigate('DataPrivacy');
          }}
          style={styles.getStartedButton}>
          {formatMessage(m.getStarted)}
        </Button>
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
    fontSize: 24,
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
    fontSize: 16,
    textAlign: 'left',
    flexShrink: 1,
    flex: 1,
  },
  getStartedButton: {
    width: '85%',
    marginTop: 16,
  },
});
