import * as React from 'react';
import TopoBackground from '../../images/TopoLogo.svg';
import CoMapeoTextAsSVG from '../../images/CoMapeoText.svg';
import WorldMap from '../../images/WorldMap.svg';
import MobilePhoneWithArrow from '../../images/MobilePhoneWithArrow.svg';
import LockedWithKey from '../../images/LockedWithKey.svg';
import RaisedFistMediumSkinTone from '../../images/RaisedFistMediumSkinTone.svg';
import {StyleSheet, View, Dimensions} from 'react-native';
import {COMAPEO_DARK_BLUE, WHITE} from '../../lib/styles';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../sharedComponents/Text';
import {Button} from '../../sharedComponents/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DeviceNamingParamsList} from '../../sharedTypes/navigation';

const {height} = Dimensions.get('window');

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
}: NativeStackScreenProps<DeviceNamingParamsList, 'IntroToCoMapeo'>) => {
  const {formatMessage} = useIntl();
  return (
    <View style={styles.container}>
      <TopoBackground style={styles.background} />
      <View style={styles.content}>
        <CoMapeoTextAsSVG width={'95%'} height={height * 0.12} />
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
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingTop: height * 0.2,
  },
  mainTextContainer: {
    width: '75%',
    marginBottom: height * 0.04,
  },
  mainText: {
    color: WHITE,
    fontSize: 24,
    textAlign: 'center',
  },
  textBox: {
    width: '95%',
    paddingVertical: height * 0.04,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: WHITE,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: height * 0.04,
  },
  textItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
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
  },
});
