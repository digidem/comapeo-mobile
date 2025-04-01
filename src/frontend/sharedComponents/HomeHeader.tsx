import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {defineMessages, useIntl} from 'react-intl';

import DeviceIcon from '../images/DeviceIcon.svg';
import {IconButton} from './IconButton';
import {HeaderText} from './Text/HeaderText';
import {WHITE} from '../lib/styles';
import {useProjectSettings} from '../hooks/server/projects';

const m = defineMessages({
  mySoloProject: {
    id: 'homeHeader.header.mySoloProject',
    defaultMessage: 'My Solo Project',
  },
});

type HomeHeaderProps = BottomTabHeaderProps & {
  openDrawer: () => void;
};

export function HomeHeader({openDrawer}: HomeHeaderProps) {
  const insets = useSafeAreaInsets();
  const {formatMessage} = useIntl();
  const {data, isPending} = useProjectSettings();

  const projectName =
    !isPending && data?.name ? data.name : formatMessage(m.mySoloProject);

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.headerRow}>
        <View style={styles.titleBox}>
          <HeaderText
            variant="header4"
            style={styles.text}
            numberOfLines={1}
            ellipsizeMode="tail">
            {projectName}
          </HeaderText>
        </View>

        <IconButton onPress={openDrawer} style={styles.iconButton}>
          <DeviceIcon
            width={32}
            height={32}
            testID="drawer-icon-home"
            accessibilityLabel="Open Navigation Drawer"
          />
        </IconButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    padding: 10,
  },
  headerRow: {
    width: '100%',
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleBox: {
    width: '90%',
    minHeight: 32,
    borderRadius: 6,
    justifyContent: 'center',
    backgroundColor: '#33333380',
  },
  text: {
    color: WHITE,
    fontFamily: 'Rubik_600SemiBold',
    paddingLeft: 5,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
