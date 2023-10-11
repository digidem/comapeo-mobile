import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../sharedComponents/Text';
import TopoLinesBackground from '../../images/TopoLinesTransparent.svg';
import CoMapeoLogo from '../../images/CoMapeoLogo.svg';
import {defineMessages, useIntl} from 'react-intl';
import {Button} from '../../sharedComponents/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DeviceNamingList} from '../../Navigation/ScreenGroups/DeviceNamingScreens';

const m = defineMessages({
  startMessage: {
    id: 'screens.DeviceNaming.GetStarted.startMessage',
    defaultMessage: 'Collaborate on mapping and monitoring projects',
  },
  getStarted: {
    id: 'screens.DeviceNaming.GetStarted.getStarted',
    defaultMessage: 'Get Started',
  },
});

const TopoLinesWidth = 360;
const TopoLineHeight = 640;

export const GetStarted = ({
  navigation,
}: NativeStackScreenProps<DeviceNamingList, 'GetStarted'>) => {
  const {formatMessage: t} = useIntl();

  return (
    <React.Fragment>
      {/* Followed this https://stackoverflow.com/questions/61657859/how-to-find-correct-values-for-width-height-and-viewbox-with-react-native-svg/61792447#61792447 to get the background completely covered */}
      <View
        style={{aspectRatio: TopoLinesWidth / TopoLineHeight, height: '100%'}}>
        <TopoLinesBackground width={'100%'} height={'100%'} />
      </View>
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <CoMapeoLogo />
          <Text style={styles.text}>{t(m.startMessage)}</Text>
        </View>
        <Button
          style={{marginTop: 20}}
          fullWidth
          onPress={() => navigation.navigate('DeviceNaming')}>
          {t(m.getStarted)}
        </Button>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
    justifyContent: 'space-between',
  },
  text: {
    marginTop: 20,
    fontSize: 20,
    textAlign: 'center',
  },
});
