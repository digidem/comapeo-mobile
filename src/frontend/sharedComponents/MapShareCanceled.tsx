import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import ErrorIcon from '../images/Error.svg';
import {IconTitleDescription} from './IconTitleDescription';
import {SecondaryButton} from './Buttons';

const m = defineMessages({
  title: {
    id: 'screens.Settings.MapManagement.MapShareCanceled.title',
    defaultMessage: 'Sharing Canceled',
  },
  message: {
    id: 'screens.Settings.MapManagement.MapShareCanceled.message',
    defaultMessage: 'Collaborator canceled sharing before completing.',
  },
  close: {
    id: 'screens.Settings.MapManagement.MapShareCanceled.close',
    defaultMessage: 'Close',
  },
});

export function MapShareCanceled({onClose}: {onClose: () => void}) {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <IconTitleDescription
          icon={<ErrorIcon width={100} height={100} />}
          title={t(m.title)}
          description={t(m.message)}
        />
      </View>
      <SecondaryButton fullSize text={t(m.close)} onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
