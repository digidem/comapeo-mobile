import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';

import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BLUE_GREY, DARK_GREY} from '../../lib/styles';

import {IconButton} from '../../sharedComponents/IconButton';
import DeviceIcon from '../../images/DeviceIcon.svg';
import {useProjectSettings} from '../../hooks/server/projects';

type ObservationsListHeaderProps = {
  openDrawer?: () => void;
};

const m = defineMessages({
  mySoloProject: {
    id: 'observationsList.header.mySoloProject',
    defaultMessage: 'My Solo Project',
  },
});

export function ObservationsListHeader({
  openDrawer,
}: ObservationsListHeaderProps) {
  const {formatMessage} = useIntl();
  const {data, isPending} = useProjectSettings();

  const projectName =
    data?.name && !isPending ? data?.name : formatMessage(m.mySoloProject);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <HeaderText variant="header4" style={styles.projectName}>
          {projectName}
        </HeaderText>
      </View>

      <IconButton onPress={openDrawer ?? (() => {})} style={styles.iconButton}>
        <DeviceIcon width={32} height={32} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 58,
    gap: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BLUE_GREY,
    paddingLeft: 15,
    paddingRight: 10,
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'column',
  },
  projectName: {
    color: DARK_GREY,
    fontFamily: 'Rubik_600SemiBold',
  },
  iconButton: {
    width: 40,
    height: 40,
  },
});
