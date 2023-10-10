import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../sharedComponents/Text';
import TopoLinesBackground from '../../images/TopoLinesTransparent.svg';
import CoMapeoLogo from '../../images/CoMapeoLogo.svg';
import {defineMessages} from 'react-intl';
import {Button} from '../../sharedComponents/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DeviceNamingList} from '../../Navigation/ScreenGroups/DeviceNamingScreens';

const m = defineMessages({});

export const GetStarted = ({
  navigation,
}: NativeStackScreenProps<DeviceNamingList, 'GetStarted'>) => {
  return (
    <React.Fragment>
      <TopoLinesBackground width={'100%'} height={'100%'} />
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <CoMapeoLogo />
          <Text style={styles.text}>
            Collaborate on mapping and monitoring projects
          </Text>
        </View>
        <Button
          style={{marginTop: 20}}
          fullWidth
          onPress={() => navigation.navigate('DeviceNaming')}>
          Get Started
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
