// src/frontend/screens/MenuHeader.tsx
import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useOwnDeviceInfo} from '@comapeo/core-react';

import {HeaderText} from './Text/HeaderText';
import DeviceIcon from '../images/DeviceIcon.svg';
import {CloseIcon} from './icons';
import {WHITE, BLUE_GREY} from '../lib/styles';

export function MenuHeader() {
  const navigation = useNavigation();
  const {data: deviceData} = useOwnDeviceInfo();
  const deviceName = deviceData?.name;

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <DeviceIcon width={32} height={32} />
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
});
