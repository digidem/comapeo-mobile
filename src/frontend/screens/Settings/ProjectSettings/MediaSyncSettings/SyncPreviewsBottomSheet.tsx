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
  syncPreviewsBottomSheet: {
    id: 'screens.SyncPreviewBottomSheet.syncPreviewsButtonBottomSheet',
    defaultMessage: 'Sync Previews?',
  },
  syncPreviewsDescriptionBottomSheet: {
    id: 'screens.SyncPreviewBottomSheet.syncPreviewsDescriptionBottomSheet',
    defaultMessage:
      'Your device will keep all existing data but new observations will sync in a smaller, preview size.',
  },
  syncPreviewWarningBottomSheet: {
    id: 'screens.SyncPreviewBottomSheet.syncPreviewWarningBottomSheet',
    defaultMessage: 'You will no longer sync Audio or Video.',
  },
  cancel: {
    id: 'screens.SyncPreviewBottomSheet.cancel',
    defaultMessage: 'Cancel',
  },
  confirm: {
    id: 'screens.SyncPreviewBottomSheet.confirm',
    defaultMessage: 'Sync Previews',
  },
});

export const SyncPreviewsBottomSheet = () => {
  const {formatMessage} = useIntl();
  const {goBack} = useNavigationFromRoot();
  const {mutate: setMediaSyncSetting} = useSetMediaSyncSetting();
  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <Warning width={60} height={60} />
        <HeaderText variant="header2" style={{marginTop: 20}}>
          {formatMessage(m.syncPreviewsBottomSheet)}
        </HeaderText>
        <BodyText style={styles.bodyText}>
          {formatMessage(m.syncPreviewsDescriptionBottomSheet)}
        </BodyText>
        <BodyText style={styles.bodyText}>
          {formatMessage(m.syncPreviewWarningBottomSheet)}
        </BodyText>
        <Button
          fullWidth
          variant="outlined"
          style={{marginTop: 30}}
          onPress={() => goBack()}>
          {formatMessage(m.cancel)}
        </Button>
        <Button
          fullWidth
          style={{marginTop: 20}}
          onPress={() => {
            setMediaSyncSetting('previews');
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
