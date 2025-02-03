import * as React from 'react';
import {NativeRootNavigationProps} from '../../../../sharedTypes/navigation';
import {defineMessages, useIntl} from 'react-intl';
import {ScreenContentWithDock} from '../../../../sharedComponents/ScreenContentWithDock';
import {Button} from '../../../../sharedComponents/Button';
import GreenCheck from '../../../../images/GreenCheck.svg';
import {StyleSheet, View} from 'react-native';
import {MEDIUM_GREY} from '../../../../lib/styles';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../../sharedComponents/Text/BodyText';

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
            navigation.navigate('RemoteArchiveOn');
          }}>
          {formatMessage(m.close)}
        </Button>
      }
      contentContainerStyle={{marginTop: 80}}>
      <View style={{alignItems: 'center'}}>
        <GreenCheck />
        <HeaderText variant="header2" style={styles.centerText}>
          {formatMessage(m.archiveAdded)}
        </HeaderText>
        <BodyText style={styles.centerText}>
          {formatMessage(m.canSyncOnInternet)}
        </BodyText>
      </View>
      <HeaderText variant="header5" style={{marginTop: 40}}>
        {archiveName}
      </HeaderText>
      <BodyText variant="smallMeta" style={{color: MEDIUM_GREY}}>
        {url}
      </BodyText>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  centerText: {textAlign: 'center', marginTop: 20},
});
