import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {SelectOne} from '../../../../sharedComponents/SelectOne';
import {SYNC_BACKGROUND} from '../../../../lib/styles';
import {MediaSyncSetting} from '../../../../sharedTypes';
import {
  UPDATE_MEDIA_SETTING,
  useGetMediaSyncSetting,
} from '../../../../hooks/server/mediaSync';
import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import {useMutationState} from '@tanstack/react-query';

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
});

export const MediaSyncSettings: NativeNavigationComponent<
  'MediaSyncSettings'
> = ({navigation}) => {
  const {formatMessage: t} = useIntl();
  const {data: mediaSyncSetting} = useGetMediaSyncSetting();

  const optimisticSyncSetting = useMutationState<MediaSyncSetting>({
    filters: {mutationKey: [UPDATE_MEDIA_SETTING], status: 'pending'},
    select: mutation => mutation.state.variables as MediaSyncSetting,
  })[0];

  const handleOptionChange = (value: MediaSyncSetting) => {
    if (value === 'previews') {
      navigation.navigate('SyncPreviewsBottomSheet');
      return;
    }
    if (value === 'everything') {
      navigation.navigate('SyncEverythingBottomSheet');
      return;
    }
  };

  const options: {
    value: MediaSyncSetting;
    label: string;
    hint: React.ReactNode;
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
        value={optimisticSyncSetting ? optimisticSyncSetting : mediaSyncSetting}
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
  },
});
