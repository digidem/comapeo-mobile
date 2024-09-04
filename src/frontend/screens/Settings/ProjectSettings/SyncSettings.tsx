import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {SelectOne} from '../../../sharedComponents/SelectOne';
import {SYNC_BACKGROUND} from '../../../lib/styles';
import {
  usePersistedSettings,
  usePersistedSettingsAction,
} from '../../../hooks/persistedState/usePersistedSettings';
import {SyncActionSheet} from './SyncActionSheet';
import {useBottomSheetModal} from '../../../sharedComponents/BottomSheetModal';

const m = defineMessages({
  syncSettingsTitle: {
    id: 'screens.SyncSettings.title',
    defaultMessage: 'Sync Settings',
  },
  syncPreviews: {
    id: 'screens.SyncSettings.syncPreviews',
    defaultMessage: 'Sync Previews (Photos Only)',
  },
  syncPreviewsDescription: {
    id: 'screens.SyncSettings.syncPreviewsDescription',
    defaultMessage:
      'Photos will sync at a reduced smaller size. Device will <bold>not</bold> sync audio or video.',
  },
  syncEverything: {
    id: 'screens.SyncSettings.syncEverything',
    defaultMessage: 'Sync Everything',
  },
  syncEverythingDescription: {
    id: 'screens.SyncSettings.syncEverythingDescription',
    defaultMessage:
      'Your device will sync <bold>all</bold> content at full size, including photos, audio, and videos.\n\nNote: This will use more storage.',
  },
  syncPreviewsBottomSheet: {
    id: 'screens.SyncSettings.syncPreviewsButtonBottomSheet',
    defaultMessage: 'Sync Previews?',
  },
  syncEverythingBottomSheet: {
    id: 'screens.SyncSettings.syncEverythingButtonBottomSheet',
    defaultMessage: 'Sync Everything?',
  },
  syncPreviewsDescriptionBottomSheet: {
    id: 'screens.SyncSettings.syncPreviewsDescriptionBottomSheet',
    defaultMessage:
      'Your device will keep all existing data but new observations will sync in a smaller, preview size.\n\nYou will no longer sync Audio or Video.',
  },
  syncEverythingDescriptionBottomSheet: {
    id: 'screens.SyncSettings.syncEverythingDescriptionBottomSheet',
    defaultMessage:
      'You are about to sync everything. This may increase the disk space used on your device.',
  },
  syncPreviewsBottomSheetConfirm: {
    id: 'screens.SyncSettings.syncPreviewsBottomSheetConfirm',
    defaultMessage: 'Sync Previews',
  },
});

export const SyncSettings = () => {
  const {formatMessage: t} = useIntl();
  const syncSetting = usePersistedSettings(store => store.syncSetting);
  const {setSyncSetting} = usePersistedSettingsAction();

  const [modalState, setModalState] = React.useState<{
    type: 'previews' | 'everything' | null;
    isOpen: boolean;
  }>({
    type: null,
    isOpen: false,
  });

  const {openSheet, closeSheet, sheetRef} = useBottomSheetModal({
    openOnMount: false,
  });

  const handleOptionChange = (value: 'previews' | 'everything') => {
    setModalState({type: value, isOpen: true});
    openSheet();
  };

  const handleConfirm = () => {
    if (modalState.type === 'previews') {
      setSyncSetting('previews');
    } else if (modalState.type === 'everything') {
      setSyncSetting('everything');
    }
    closeSheet();
  };

  const options: {
    value: 'previews' | 'everything';
    label: string;
    hint?: string;
  }[] = [
    {
      value: 'previews',
      label: t(m.syncPreviews),
      hint: t(m.syncPreviewsDescription),
    },
    {
      value: 'everything',
      label: t(m.syncEverything),
      hint: t(m.syncEverythingDescription),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <SelectOne
        value={syncSetting}
        onChange={handleOptionChange}
        options={options}
        radioButtonPosition="right"
        color={SYNC_BACKGROUND}
      />
      <SyncActionSheet
        title={
          modalState.type === 'previews'
            ? t(m.syncPreviewsBottomSheet)
            : t(m.syncEverythingBottomSheet)
        }
        description={
          modalState.type === 'previews'
            ? t(m.syncPreviewsDescriptionBottomSheet)
            : t(m.syncEverythingDescriptionBottomSheet)
        }
        confirmActionText={
          modalState.type === 'previews'
            ? t(m.syncPreviewsBottomSheetConfirm)
            : t(m.syncEverything)
        }
        confirmAction={handleConfirm}
        isOpen={modalState.isOpen}
        onDismiss={() => {
          setModalState({type: null, isOpen: false});
          closeSheet();
        }}
        ref={sheetRef}
      />
    </ScrollView>
  );
};

SyncSettings.navTitle = m.syncSettingsTitle;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
