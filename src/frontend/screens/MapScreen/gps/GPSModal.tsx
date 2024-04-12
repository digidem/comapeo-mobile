import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {GPSDisabled} from './GPSDisabled';
import {GPSEnabled} from './GPSEnabled';
import {useForegroundPermissions} from 'expo-location';

export const GPSModal = () => {
  const [permissions] = useForegroundPermissions();
  const [isGranted, setIsGranted] = useState<boolean | null>(null);

  useEffect(() => {
    if (permissions && isGranted === null) {
      setIsGranted(permissions!.granted);
    }
  }, [permissions]);

  return (
    <View style={styles.wrapper}>
      {isGranted ? <GPSEnabled /> : <GPSDisabled setIsGranted={setIsGranted} />}
    </View>
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
