import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import SuccessIcon from '../../images/Success.svg';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';

const m = defineMessages({
  mapUpdated: {
    id: 'screens.Settings.MapManagement.BackgroundMapUpdated.mapUpdated',
    defaultMessage: 'Background map updated.',
  },
  done: {
    id: 'screens.Settings.MapManagement.BackgroundMapUpdated.done',
    defaultMessage: 'Done',
  },
});

export function BackgroundMapUpdated({
  navigation,
}: NativeRootNavigationProps<'BackgroundMapUpdated'>) {
  const {formatMessage: t} = useIntl();

  const handleDone = () => {
    navigation.popTo('BackgroundMaps');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <SuccessIcon />
        <HeaderText variant="header2" style={styles.headerText}>
          {t(m.mapUpdated)}
        </HeaderText>
      </View>
      <View style={{alignItems: 'center'}}>
        <SecondaryButton fullSize text={t(m.done)} onPress={handleDone} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    paddingTop: 180,
    alignItems: 'center',
    gap: 30,
  },
  headerText: {
    textAlign: 'center',
  },
});
