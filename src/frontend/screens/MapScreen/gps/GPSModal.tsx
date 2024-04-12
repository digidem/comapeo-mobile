import React from 'react';
import {View, StyleSheet} from 'react-native';
import {GPSDisabled} from './GPSDisabled';
import {GPSEnabled} from './GPSEnabled';
import {useGPSModalContext} from '../../../contexts/GPSModalContext';
import {useForegroundPermissions} from 'expo-location';

export const GPSModal = () => {
  const {displayModal} = useGPSModalContext();
  const [permissions] = useForegroundPermissions();

  console.log(permissions, 'permissions');

  return (
    <>
      {displayModal && (
        <View style={styles.wrapper}>
          {permissions && !!permissions.granted ? (
            <GPSEnabled />
          ) : (
            <GPSDisabled />
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#fff',
  },
});
