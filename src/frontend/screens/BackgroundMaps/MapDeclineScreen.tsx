import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import StackSvg from '../../images/Stack.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {VERY_LIGHT_GREY, RED, NEW_DARK_GREY, BLACK} from '../../lib/styles';

const m = defineMessages({
  mapDeclined: {
    id: 'screens.Settings.MapManagement.MapDeclineScreen.mapDeclined',
    defaultMessage: 'Map declined.',
  },
  deviceNoSpace: {
    id: 'screens.Settings.MapManagement.MapDeclineScreen.deviceNoSpace',
    defaultMessage: 'Device does not have enough space.',
  },
  close: {
    id: 'screens.Settings.MapManagement.MapDeclineScreen.close',
    defaultMessage: 'Close',
  },
});

export function MapDeclineScreen({
  route,
  navigation,
}: NativeRootNavigationProps<'MapDeclineScreen'>) {
  const {formatMessage: t} = useIntl();

  const {reason} = route.params;

  const isDiskSpaceIssue = reason === 'DISK_SPACE';

  const headerText = isDiskSpaceIssue ? t(m.deviceNoSpace) : t(m.mapDeclined);

  const handleClose = () => {
    navigation.popTo('BackgroundMaps');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <View style={styles.iconBackground}>
            <StackSvg width={47} height={50} color={NEW_DARK_GREY} />
          </View>
          <View style={styles.warningBadge}>
            <MaterialIcon name="error" size={30} color={RED} />
          </View>
        </View>

        <HeaderText variant="header2" style={styles.headerText}>
          {headerText}
        </HeaderText>
      </View>

      <View style={styles.buttonContainer}>
        <SecondaryButton fullSize text={t(m.close)} onPress={handleClose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: VERY_LIGHT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningBadge: {
    position: 'absolute',
    right: -5,
    bottom: -5,
  },
  headerText: {
    textAlign: 'center',
    color: BLACK,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
