import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {defineMessages, useIntl} from 'react-intl';

import DeviceIcon from '../images/DeviceIcon.svg';
import {IconButton} from './IconButton';
import {HeaderText} from './Text/HeaderText';
import {BLUE_GREY, WHITE} from '../lib/styles';
import {useProjectSettings} from '../hooks/server/projects';

const m = defineMessages({
  mySoloProject: {
    id: 'homeHeader.header.mySoloProject',
    defaultMessage: 'My Solo Project',
  },
});

type HomeHeaderProps = BottomTabHeaderProps & {
  backgroundColor?: string;
  showBottomBorder?: boolean;
};

export function HomeHeader({
  backgroundColor = 'transparent',
  showBottomBorder = false,
  navigation,
}: HomeHeaderProps) {
  const {formatMessage} = useIntl();
  const {data} = useProjectSettings();

  const projectName = data?.name ? data.name : formatMessage(m.mySoloProject);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderBottomWidth: showBottomBorder ? 1 : 0,
          borderBottomColor: showBottomBorder ? BLUE_GREY : 'transparent',
        },
      ]}>
      <View style={styles.headerRow}>
        <View style={styles.titleBox}>
          <HeaderText
            testID="HOME.header-title"
            variant="header4"
            style={styles.text}
            numberOfLines={1}
            ellipsizeMode="tail">
            {projectName}
          </HeaderText>
        </View>

        <IconButton
          style={styles.iconButton}
          onPress={() => {
            navigation.navigate('Menu');
          }}>
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
    width: '85%',
    minHeight: 32,
    borderRadius: 6,
    justifyContent: 'center',
    backgroundColor: '#333333E6',
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
