import React from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {IconButton} from './IconButton';
import {ObservationListIcon} from './icons';
import {useNavigationFromHomeTabs} from '../hooks/useNavigationWithTypes';
import {GPSIndicator} from '../screens/MapScreen/gps/GPSIndicator';

export const HomeHeader = () => {
  const navigation = useNavigationFromHomeTabs();

  return (
    <View style={[styles.header]}>
      <LinearGradient
        style={styles.linearGradient}
        colors={['#0006', '#0000']}
      />
      {/* Stand in for styling,  */}
      <View style={{width: 60}} />
      <GPSIndicator />

      <IconButton
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
  linearGradient: {
    height: 60,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
});
