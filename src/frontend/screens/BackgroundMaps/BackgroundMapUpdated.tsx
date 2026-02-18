import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import SuccessIcon from '../../images/Success.svg';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
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
        <IconTitleDescription icon={<SuccessIcon />} title={t(m.mapUpdated)} />
      </View>
      <View style={styles.buttonContainer}>
        <SecondaryButton fullSize text={t(m.done)} onPress={handleDone} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, justifyContent: 'space-between'},
  content: {flex: 1, justifyContent: 'center'},
  buttonContainer: {alignItems: 'center'},
});
