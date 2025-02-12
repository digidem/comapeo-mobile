import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BottomSheetWrapper} from '../../../../sharedComponents/BottomSheetWrapper';
import {defineMessages, useIntl} from 'react-intl';
import Warning from '../../../../images/Warning.svg';
import {Button} from '../../../../sharedComponents/Button';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import {useNavigationFromRoot} from '../../../../hooks/useNavigationWithTypes';
import {BodyText} from '../../../../sharedComponents/Text/BodyText';
import {useSetMediaSyncSetting} from '../../../../hooks/server/mediaSync';

const m = defineMessages({
  cancel: {
    id: 'screens.SyncEverythingBottomSheet.cancel',
    defaultMessage: 'Cancel',
  },
  confirm: {
    id: 'screens.SyncEverythingBottomSheet.confirm',
    defaultMessage: 'Sync Everything',
  },
  syncEverything: {
    id: 'screens.SyncEverythingBottomSheet.syncEverything',
    defaultMessage: 'Sync Everything?',
  },
  syncEverythingDescription: {
    id: 'screens.SyncEverythingBottomSheet.syncEverythingDescription',
    defaultMessage:
      'You are about to sync everything. This may increase the disk space used on your device.',
  },
});

export const SyncEverythingBottomSheet = () => {
  const {formatMessage} = useIntl();
  const {goBack} = useNavigationFromRoot();
  const {mutate: setMediaSyncSetting} = useSetMediaSyncSetting();
  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <Warning width={60} height={60} />
        <HeaderText variant="header2" style={{marginTop: 20}}>
          {formatMessage(m.syncEverything)}
        </HeaderText>
        <BodyText style={styles.bodyText}>
          {formatMessage(m.syncEverythingDescription)}
        </BodyText>
        <Button
          fullWidth
          variant="outlined"
          color="ComapeoBlue"
          style={{marginTop: 30}}
          onPress={() => goBack()}>
          {formatMessage(m.cancel)}
        </Button>
        <Button
          fullWidth
          style={{marginTop: 20}}
          onPress={() => {
            setMediaSyncSetting('everything');
            goBack();
          }}>
          {formatMessage(m.confirm)}
        </Button>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  bodyText: {
    marginTop: 10,
    textAlign: 'center',
  },
});
