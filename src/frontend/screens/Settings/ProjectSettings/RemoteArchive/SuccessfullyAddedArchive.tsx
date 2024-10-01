import * as React from 'react';
import {NativeRootNavigationProps} from '../../../../sharedTypes/navigation';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../../../sharedComponents/Text';
import {ScreenContentWithDock} from '../../../../sharedComponents/ScreenContentWithDock';
import {Button} from '../../../../sharedComponents/Button';
import GreenCheck from '../../../../images/GreenCheck.svg';
import {StyleSheet, View} from 'react-native';
import {MEDIUM_GREY} from '../../../../lib/styles';

const m = defineMessages({
  archiveAdded: {
    id: 'ProjectSettings.RemoteArchive.Success.archiveAdded',
    defaultMessage: 'Remote Archive Added',
  },
  canSyncOnInternet: {
    id: 'ProjectSettings.RemoteArchive.Success.canSyncOnInternet',
    defaultMessage:
      'All project devices can sync with this Archive, sharing data over the internet.',
  },
  close: {
    id: 'ProjectSettings.RemoteArchive.Success.close',
    defaultMessage: 'Close',
  },
});

export const SuccessfullyAddedArchive = ({
  route,
  navigation,
}: NativeRootNavigationProps<'SuccessfullyAddedArchive'>) => {
  const {formatMessage} = useIntl();
  const {archiveName, url} = route.params;
  return (
    <ScreenContentWithDock
      dockContent={
        <Button
          fullWidth
          variant="outlined"
          onPress={() => {
            navigation.navigate('Home', {screen: 'Map'});
          }}>
          {formatMessage(m.close)}
        </Button>
      }
      contentContainerStyle={{marginTop: 80}}>
      <View style={{alignItems: 'center'}}>
        <GreenCheck />
        <Text style={[styles.centerText, {fontSize: 32}]}>
          {formatMessage(m.archiveAdded)}
        </Text>
        <Text style={styles.centerText}>
          {formatMessage(m.canSyncOnInternet)}
        </Text>
      </View>
      <Text style={{marginTop: 40}}>{archiveName}</Text>
      <Text style={{color: MEDIUM_GREY}}>{url}</Text>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  centerText: {textAlign: 'center', marginTop: 20},
});
