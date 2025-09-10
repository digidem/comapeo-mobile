import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useOwnDeviceInfo} from '@comapeo/core-react';

import {HeaderText} from './Text/HeaderText';
import DeviceIcon from '../images/DeviceIcon.svg';
import {CloseIcon} from './icons';
import {WHITE, BLUE_GREY} from '../lib/styles';
import {useStorageReadingQuery} from '../hooks/useStorageReadingQuery';
import {isLowStorage} from '../lib/storage';
import {ExclamationBadge} from './ExclamationBadge';

export function MenuHeader() {
  const navigation = useNavigation();
  const {data: deviceData} = useOwnDeviceInfo();
  const deviceName = deviceData?.name;
  const {data} = useStorageReadingQuery();
  const isLow = isLowStorage(data.freeBytes);

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <View style={styles.deviceWrap} pointerEvents="box-none">
          <DeviceIcon width={32} height={32} />
          {isLow && (
            <View style={{position: 'absolute', top: -2, right: -2}}>
              <ExclamationBadge testID="low-storage-badge-settings" />
            </View>
          )}
        </View>
        <HeaderText variant="header4">{deviceName}</HeaderText>
      </View>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        accessibilityLabel="Close Menu">
        <CloseIcon size={32} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BLUE_GREY,
  },
  leftRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deviceWrap: {
    width: 32,
    height: 32,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
