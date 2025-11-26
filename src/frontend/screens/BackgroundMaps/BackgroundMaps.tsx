import {type NativeStackNavigationOptions} from '@react-navigation/native-stack';
import React from 'react';
import {defineMessages, useIntl, type MessageDescriptor} from 'react-intl';
import {ScrollView, StyleSheet, View} from 'react-native';

import {useSelectFile} from '../../hooks/files';
import {
  useGetCustomMapInfo,
  useImportCustomMapFile,
  useRemoveCustomMapFile,
} from '../../hooks/server/maps';
import {RED} from '../../lib/styles';
import {Button} from '../../sharedComponents/Button';
import {Loading} from '../../sharedComponents/Loading';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {ChooseMapFile} from './ChooseMapFile';
import {CustomMapDetails} from './CustomMapDetails';
import * as Sentry from '@sentry/react-native';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

const m = defineMessages({
  screenTitle: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.screenTitle',
    defaultMessage: 'Background Map',
  },
  description1: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.description1',
    defaultMessage: 'Custom background maps let you view maps offline.',
  },
  // TODO: Merge into description1 when https://github.com/digidem/comapeo-mobile/issues/669 is addressed
  description2: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.description2',
    defaultMessage:
      'Note: Custom background maps are not shared with collaborators.',
  },

  customMapInfoLoadError: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.customMapInfoLoadError',
    defaultMessage:
      'Could not get custom map information from file. Please remove it or choose a different file.',
  },
  removeMapFile: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.removeMapFile',
    defaultMessage: 'Remove Map File',
  },

  customMapAddedTitle: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.customMapAddedTitle',
    defaultMessage: 'Custom Map Added',
  },
  customMapAddedDescription: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.customMapAddedDescription',
    defaultMessage:
      'You will see this map when you are offline, but you will not see a map outside the area defined in your custom map.',
  },
  close: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.close',
    defaultMessage: 'Close',
  },

  deleteCustomMapTitle: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.deleteCustomMapTitle',
    defaultMessage: 'Delete Custom Map?',
  },
  deleteCustomMapDescription: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.deleteCustomMapDescription',
    defaultMessage:
      'This will delete the map and its offline areas. No collected observation data will be deleted.',
  },
  // TODO: Merge into deleteCustomMapDescription when https://github.com/digidem/comapeo-mobile/issues/669 is addressed
  cannotBeUndone: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.cannotBeUndone',
    defaultMessage: 'This cannot be undone.',
  },
  deleteMapButtonText: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.deleteMapButtonText',
    defaultMessage: 'Delete Map',
  },

  importErrorTitle: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.importErrorTitle',
    defaultMessage: 'Import Error',
  },
  importErrorDesciption: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.importErrorDescription',
    defaultMessage: 'Unable to import the file. Please go back and try again.',
  },
});

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}): (
  props: NativeRootNavigationProps<'BackgroundMaps'>,
) => NativeStackNavigationOptions {
  return () => {
    return {
      title: intl(m.screenTitle),
    };
  };
}

export function BackgroundMapsScreen() {
  const {formatMessage: t} = useIntl();

  const {navigate} = useNavigationFromRoot();

  const selectFileMutation = useSelectFile();
  const importCustomMapMutation = useImportCustomMapFile();
  const removeCustomMapMutation = useRemoveCustomMapFile();
  const customMapInfoQuery = useGetCustomMapInfo();

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.descriptionContainer}>
          <BodyText>{t(m.description1)}</BodyText>
          <BodyText>{t(m.description2)}</BodyText>
        </View>

        <CustomMapInfoSection
          onChooseFile={() => {
            selectFileMutation.mutate(
              {
                copyToCacheDirectory: false,
                allowedExtensions: ['smp'],
              },
              {
                onSuccess: asset => {
                  if (!asset) return;

                  importCustomMapMutation.mutate(
                    {
                      uri: asset.uri,
                    },
                    {
                      onSuccess: () => {
                        navigate('MapAddedBottomSheet');
                      },
                      onError: err => {
                        Sentry.captureException(err);
                        navigate('BackgroundMapErrorBottomSheet', {
                          title: t(m.importErrorTitle),
                          description: t(m.importErrorDesciption),
                        });
                      },
                    },
                  );
                },
                onError: err => {
                  Sentry.captureException(err);
                  navigate('BackgroundMapErrorBottomSheet', {
                    title: t(m.importErrorTitle),
                    description: t(m.importErrorDesciption),
                  });
                },
              },
            );
          }}
          onRemoveMap={() => {
            navigate('DeleteCustomMapBottomSheet');
          }}
        />

        {customMapInfoQuery.status === 'error' && (
          <>
            <BodyText variant="large" style={styles.infoLoadErrorText}>
              {t(m.customMapInfoLoadError)}
            </BodyText>
            <Button
              fullWidth
              variant="outlined"
              onPress={() => {
                removeCustomMapMutation.mutate(undefined, {
                  onError: err => {
                    Sentry.captureException(err);
                    navigate('ErrorBottomSheet');
                  },
                });
              }}>
              <HeaderText
                variant="header5"
                style={styles.removeMapFileButtonText}>
                {t(m.removeMapFile)}
              </HeaderText>
            </Button>
          </>
        )}
      </ScrollView>
    </>
  );
}

function CustomMapInfoSection({
  onChooseFile,
  onRemoveMap,
}: {
  onChooseFile: () => void;
  onRemoveMap: () => void;
}) {
  const customMapInfoQuery = useGetCustomMapInfo();

  if (customMapInfoQuery.status === 'pending') {
    return <Loading size={10} />;
  }

  if (customMapInfoQuery.data) {
    return (
      <CustomMapDetails
        loading={customMapInfoQuery.isFetching}
        name={customMapInfoQuery.data.name}
        dateAdded={customMapInfoQuery.data.created}
        size={customMapInfoQuery.data.size}
        onRemove={onRemoveMap}
      />
    );
  }

  return customMapInfoQuery.isFetching ? (
    <Loading size={10} />
  ) : (
    <ChooseMapFile onChooseFile={onChooseFile} />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 36,
  },
  descriptionContainer: {
    gap: 20,
  },
  infoLoadErrorText: {
    textAlign: 'center',
    color: RED,
  },
  removeMapFileButtonText: {
    letterSpacing: 0.5,
    color: RED,
  },
});
