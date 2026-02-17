import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import SuccessIcon from '../../images/Success.svg';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';

const m = defineMessages({
  mapSent: {
    id: 'screens.Settings.MapManagement.MapSent.mapSent',
    defaultMessage: 'Map sent!',
  },
  done: {
    id: 'screens.Settings.MapManagement.MapSent.done',
    defaultMessage: 'Done',
  },
});

export function MapSent({navigation}: NativeRootNavigationProps<'MapSent'>) {
  const {formatMessage: t} = useIntl();

  React.useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, [navigation]);

  const handleDone = () => {
    navigation.popTo('BackgroundMaps');
  };

  return (
    <View style={styles.container}>
      <IconTitleDescription
        style={styles.content}
        icon={<SuccessIcon />}
        title={t(m.mapSent)}
      />
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
  },
});
