import * as React from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import {SelectOne} from '../../../sharedComponents/SelectOne';
import {SYNC_BACKGROUND, NEW_DARK_GREY} from '../../../lib/styles';
import {
  usePersistedSettings,
  usePersistedSettingsAction,
} from '../../../hooks/persistedState/usePersistedSettings';

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
      'Photos will sync at a reduced smaller size. Device will not sync audio or video.',
  },
  syncEverything: {
    id: 'screens.SyncSettings.syncEverything',
    defaultMessage: 'Sync Everything',
  },
  syncEverythingDescription: {
    id: 'screens.SyncSettings.syncEverythingDescription',
    defaultMessage:
      'Your device will sync all content at full size, including photos, audio, and videos.\n\nNote: This will use more storage.',
  },
});

export const SyncSettings = () => {
  const {formatMessage: t} = useIntl();
  const syncSetting = usePersistedSettings(store => store.syncSetting);
  const {setSyncSetting} = usePersistedSettingsAction();

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
        onChange={setSyncSetting}
        options={options}
      />
    </ScrollView>
  );
};

SyncSettings.navTitle = m.syncSettingsTitle;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  optionContainer: {
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: 'black',
    flex: 1,
  },
  hint: {
    fontSize: 14,
    color: NEW_DARK_GREY,
    flex: 3,
    marginLeft: 20,
  },
  note: {
    marginTop: 20,
    fontSize: 12,
    color: NEW_DARK_GREY,
  },
});
