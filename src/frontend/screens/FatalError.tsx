import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import RNRestart from 'react-native-restart';
import {WHITE} from '../lib/styles';
import {defineMessages, useIntl} from 'react-intl';
import {MapPinErrorIcon} from '../sharedComponents/MapPinErrorIcon';
import {PrimaryButton} from '../sharedComponents/Buttons';
import {HeaderText} from '../sharedComponents/Text/HeaderText';

const m = defineMessages({
  somethingWrong: {
    id: 'screens.FatalError.somethingWrong',
    defaultMessage: 'Something Went Wrong',
  },
  restart: {
    id: 'screens.FatalError.restart',
    defaultMessage: 'Restart App',
  },
});

export const FatalError = () => {
  const {formatMessage} = useIntl();
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <MapPinErrorIcon />
        <HeaderText style={styles.text}>
          {formatMessage(m.somethingWrong)}
        </HeaderText>
      </View>
      <PrimaryButton
        fullSize
        text={formatMessage(m.restart)}
        renderIcon={({size, color}) => {
          return <MaterialIcon size={size} name="refresh" color={color} />;
        }}
        onPress={() => {
          RNRestart.restart();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WHITE,
  },
  text: {
    marginTop: 20,
  },
});
