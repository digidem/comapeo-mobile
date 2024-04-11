import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {GPSDisabled} from './GPSDisabled';
import {GPSEnabled} from './GPSEnabled';
import {useGPSModalContext} from '../../../contexts/GPSModalContext';

interface GPSModal {
  locationServicesEnabled: boolean;
}
export const GPSModal: FC<GPSModal> = ({locationServicesEnabled}) => {
  const {displayModal} = useGPSModalContext();

  return (
    <>
      {displayModal && (
        <View style={styles.wrapper}>
          {locationServicesEnabled ? <GPSEnabled /> : <GPSDisabled />}
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
