import React from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {IconButton} from './IconButton';
import {ObservationListIcon, SyncIconCircle} from './icons';
import {useNavigationFromHomeTabs} from '../hooks/useNavigationWithTypes';
import useWifiStatus from '../hooks/useWifiStatus';

export const HomeHeader = () => {
  const navigation = useNavigationFromHomeTabs();
  const wifiName = useWifiStatus();

  return (
    <View style={[styles.header]}>
      <LinearGradient
        style={styles.linearGradient}
        colors={['#0006', '#0000']}
      />
      <IconButton
        style={styles.leftButton}
        onPress={() => {
          navigation.navigate('NoWifi');
          //navigation.navigate(wifiName?"SyncModal":"NoWifi");
        }}>
        <SyncIconCircle />
      </IconButton>
      <IconButton
        style={styles.rightButton}
        onPress={() => {
          navigation.navigate('ObservationList');
        }}
        testID="observationListButton">
        <ObservationListIcon />
      </IconButton>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  rightButton: {},
  leftButton: {
    width: 60,
    height: 60,
  },
  linearGradient: {
    height: 60,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
});
