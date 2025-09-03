import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useOwnDeviceInfo} from '@comapeo/core-react';

import {HeaderText} from './Text/HeaderText';
import DeviceIcon from '../images/DeviceIcon.svg';
import {CloseIcon} from './icons';
import {WHITE, BLUE_GREY, DARK_ORANGE} from '../lib/styles';
import {
  isLowStorage,
  useStorageReadingQuery,
} from '../hooks/useStorageReadingQuery';

export function MenuHeader() {
  const navigation = useNavigation();
  const {data: deviceData} = useOwnDeviceInfo();
  const deviceName = deviceData?.name;
  const {data} = useStorageReadingQuery();
  const isLow = isLowStorage(data?.freeBytes ?? null);

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <View style={styles.deviceWrap} pointerEvents="box-none">
          <DeviceIcon width={32} height={32} />
          {isLow && (
            <View
              testID="low-storage-badge-settings"
              accessibilityLabel="Low storage alert"
              style={styles.badge}
              pointerEvents="none">
              <Text style={styles.mark}>!</Text>
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
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DARK_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    color: WHITE,
    fontSize: 7,
    fontWeight: '700',
    includeFontPadding: false,
    textAlign: 'center',
  },
});
