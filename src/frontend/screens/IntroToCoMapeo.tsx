import * as React from 'react';
import TopoBackground from '../images/TopoLogo.svg';
import CoMapeoTextAsSVG from '../images/CoMapeoText.svg';
import {StyleSheet, View, Image} from 'react-native';
import {COMAPEO_DARK_BLUE, WHITE} from '../lib/styles';
import {getVersion} from 'react-native-device-info';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../sharedComponents/Text';
import {Button} from '../sharedComponents/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DeviceNamingSceens} from '../Navigation/Stack/DeviceNamingScreens';

const m = defineMessages({
  isNow: {
    id: 'screens.IntroToCoMapeo.isNow',
    defaultMessage: 'is now',
    description: "The full sentence is mapeo 'is now' comapeo. ",
  },
  version: {
    id: 'screens.IntroToCoMapeo.version',
    defaultMessage: 'V',
    description:
      'v is short for version. the translation for version can be used instead',
  },
  collaborate: {
    id: 'screens.IntroToCoMapeo.collaborate',
    defaultMessage: 'Collaborate on mapping and monitoring projects',
  },
  getStarted: {
    id: 'screens.IntroToCoMapeo.getStarted',
    defaultMessage: 'Get Started',
  },
});

export const IntroToCoMapeo = ({
  navigation,
}: NativeStackScreenProps<DeviceNamingSceens, 'IntroToCoMapeo'>) => {
  const {formatMessage} = useIntl();
  return (
    <View style={{backgroundColor: COMAPEO_DARK_BLUE}}>
      <TopoBackground height={'100%'} />
      <View style={styles.content}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <View style={styles.mapeoContainer}>
            {/* TO DO: change this image to an svg so it can inherit the blue background (I don't have edit access to figma to export it and Sabella is on vacay) */}
            <Image
              style={{marginRight: 10}}
              source={require('../images/icon_mapeo_pin.png')}
            />
            <Text style={[styles.text, {fontSize: 40}]}>MAPEO</Text>
          </View>
          <Text style={[styles.text, {fontSize: 20, marginTop: 20}]}>
            {formatMessage(m.isNow)}
          </Text>
          <CoMapeoTextAsSVG style={{marginTop: -30}} width={'90%'} />
          <Text style={styles.text}>{`${formatMessage(
            m.version,
          )} ${getVersion()}`}</Text>
        </View>
        <View style={{width: '100%'}}>
          <Text
            style={[
              styles.text,
              {fontSize: 20, marginBottom: 30, fontWeight: '500'},
            ]}>
            {formatMessage(m.collaborate)}
          </Text>
          <Button
            fullWidth
            onPress={() => {
              navigation.navigate('DeviceNaming');
            }}>
            {formatMessage(m.getStarted)}
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: WHITE,
    textAlign: 'center',
  },
  mapeoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
