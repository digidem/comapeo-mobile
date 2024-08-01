import * as React from 'react';
import TopoBackground from '../images/TopoLogo.svg';
import CoMapeoTextAsSVG from '../images/CoMapeoText.svg';
import {StyleSheet, View, Image} from 'react-native';
import {COMAPEO_DARK_BLUE, WHITE} from '../lib/styles';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../sharedComponents/Text';
import {Button} from '../sharedComponents/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DeviceNamingParamsList} from '../sharedTypes/navigation';

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
        <CoMapeoTextAsSVG style={{marginTop: -30}} width={'90%'} />
        <Text style={styles.mainText}>{formatMessage(m.mapWorldTogether)}</Text>
        <View style={styles.textBox}>
          <View style={styles.textItem}>
            <Image
              source={require('../images/world-map-emoji.png')}
              style={styles.icon}
            />
            <Text style={styles.text}>{formatMessage(m.mapAnywhere)}</Text>
          </View>
          <View style={styles.textItem}>
            <Image
              source={require('../images/mobile-phone-with-arrow.png')}
              style={styles.icon}
            />
            <Text style={styles.text}>{formatMessage(m.collaborate)}</Text>
          </View>
          <View style={styles.textItem}>
            <Image
              source={require('../images/locked-with-key.png')}
              style={styles.icon}
            />
            <Text style={styles.text}>{formatMessage(m.ownData)}</Text>
          </View>
          <View style={styles.textItem}>
            <Image
              source={require('../images/raised-fist-medium-skin-tone.png')}
              style={styles.icon}
            />
            <Text style={styles.text}>{formatMessage(m.designedFor)}</Text>
          </View>
        </View>
        <Button
          testID="ONBOARDING.get-started-btn"
          fullWidth
          onPress={() => {
            navigation.navigate('DeviceNaming');
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
    paddingTop: 80,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainText: {
    color: WHITE,
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  textBox: {
    width: '90%',
    padding: 20,
    borderWidth: 1,
    borderColor: WHITE,
    borderRadius: 10,
    backgroundColor: '#123456',
  },
  textItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  text: {
    color: WHITE,
    fontSize: 16,
    textAlign: 'left',
  },
  getStartedButton: {
    marginTop: 30,
  },
});
