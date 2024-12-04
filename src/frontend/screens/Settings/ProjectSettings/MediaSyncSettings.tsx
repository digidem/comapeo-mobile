import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {SelectOne} from '../../../sharedComponents/SelectOne';
import {SYNC_BACKGROUND} from '../../../lib/styles';
import {
  usePersistedSettings,
  usePersistedSettingsAction,
} from '../../../hooks/persistedState/usePersistedSettings';
import {MediaSyncActionSheetContent} from './MediaSyncActionSheetContent';
import {
  useBottomSheetModal,
  BottomSheetModal,
} from '../../../sharedComponents/BottomSheetModal';
import {MediaSyncSetting} from '../../../sharedTypes';
import {
  NativeNavigationComponent,
  NativeRootNavigationProps,
} from '../../../sharedTypes/navigation';

const m = defineMessages({
  syncSettingsTitle: {
    id: 'screens.MediaSyncSettings.title',
    defaultMessage: 'Sync Settings',
  },
  syncPreviews: {
    id: 'screens.MediaSyncSettings.syncPreviews',
    defaultMessage: 'Sync Previews (Photos Only)',
  },
  syncPreviewsDescription: {
    id: 'screens.MediaSyncSettings.syncPreviewsDescription',
    defaultMessage:
      'Photos will sync at a reduced smaller size. Device will <bold>not</bold> sync audio or video.',
  },
  syncEverything: {
    id: 'screens.MediaSyncSettings.syncEverything',
    defaultMessage: 'Sync Everything',
  },
  syncEverythingDescription: {
    id: 'screens.MediaSyncSettings.syncEverythingDescription',
    defaultMessage:
      'Your device will sync <bold>all</bold> content at full size, including photos, audio, and videos.',
  },
  syncEverythingWarning: {
    id: 'screens.MediaSyncSettings.syncEverythingWarning',
    defaultMessage: 'Note: This will use more storage.',
  },
  syncPreviewsBottomSheet: {
    id: 'screens.MediaSyncSettings.syncPreviewsButtonBottomSheet',
    defaultMessage: 'Sync Previews?',
  },
  syncEverythingBottomSheet: {
    id: 'screens.MediaSyncSettings.syncEverythingButtonBottomSheet',
    defaultMessage: 'Sync Everything?',
  },
  syncPreviewsDescriptionBottomSheet: {
    id: 'screens.MediaSyncSettings.syncPreviewsDescriptionBottomSheet',
    defaultMessage:
      'Your device will keep all existing data but new observations will sync in a smaller, preview size.',
  },
  syncPreviewWarningBottomSheet: {
    id: 'screens.MediaSyncSettings.syncPreviewWarningBottomSheet',
    defaultMessage: 'You will no longer sync Audio or Video.',
  },
  syncEverythingDescriptionBottomSheet: {
    id: 'screens.MediaSyncSettings.syncEverythingDescriptionBottomSheet',
    defaultMessage:
      'You are about to sync everything. This may increase the disk space used on your device.',
  },
  syncPreviewsBottomSheetConfirm: {
    id: 'screens.MediaSyncSettings.syncPreviewsBottomSheetConfirm',
    defaultMessage: 'Sync Previews',
  },
});

export const MediaSyncSettings = ({
  navigation,
  route,
}: NativeRootNavigationProps<'MediaSyncSettings'>) => {
  const {formatMessage: t} = useIntl();
  // const mediaSyncSetting = usePersistedSettings(
  //   store => store.mediaSyncSetting,
  // );

  const [mediaSyncSetting, setValue] =
    React.useState<MediaSyncSetting>('previews');

  React.useEffect(() => {
    if (mediaSyncSetting === route.params.mediaSyncSetting) return;
    else setValue(route.params.mediaSyncSetting);
  }, [mediaSyncSetting, route.params.mediaSyncSetting]);

  const handleOptionChange = (value: MediaSyncSetting) => {
    navigation.navigate('Modals', {
      screen: 'MediaSyncModal',
      params: {
        value,
      },
    });
  };

  const options: {
    value: MediaSyncSetting;
    label: string;
    hint?: React.ReactNode;
  }[] = [
    {
      value: 'previews',
      label: t(m.syncPreviews),
      hint: t(m.syncPreviewsDescription),
    },
    {
      value: 'everything',
      label: t(m.syncEverything),
      hint: (
        <>
          {t(m.syncEverythingDescription)}
          {'\n\n'}
          {t(m.syncEverythingWarning)}
        </>
      ),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <SelectOne
        value={mediaSyncSetting}
        onChange={handleOptionChange}
        options={options}
        radioButtonPosition="right"
        color={SYNC_BACKGROUND}
      />
    </ScrollView>
  );
};

MediaSyncSettings.navTitle = m.syncSettingsTitle;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'cyan',
  },
});
