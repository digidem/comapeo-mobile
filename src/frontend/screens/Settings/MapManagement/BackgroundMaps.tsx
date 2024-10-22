import {type NativeStackNavigationOptions} from '@react-navigation/native-stack';
import React from 'react';
import {defineMessages, useIntl, type MessageDescriptor} from 'react-intl';
import {ScrollView, StyleSheet, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as FileSystem from 'expo-file-system';

import {
  useGetCustomMapInfo,
  useImportCustomMapFile,
  useRemoveCustomMapFile,
  useSelectCustomMapFile,
} from '../../../hooks/server/maps';
import ErrorSvg from '../../../images/Error.svg';
import GreenCheckSvg from '../../../images/GreenCheck.svg';
import {DARK_GREY, RED, WHITE} from '../../../lib/styles';
import {
  BottomSheetModal,
  BottomSheetModalContent,
  useBottomSheetModal,
} from '../../../sharedComponents/BottomSheetModal';
import {Button} from '../../../sharedComponents/Button';
import {ErrorBottomSheet} from '../../../sharedComponents/ErrorBottomSheet';
import {Loading} from '../../../sharedComponents/Loading';
import {Text} from '../../../sharedComponents/Text';
import {type NativeRootNavigationProps} from '../../../sharedTypes/navigation';
import {ChooseMapFile} from './ChooseMapFile';
import {CustomMapDetails} from './CustomMapDetails';
import noop from '../../../lib/noop';

const m = defineMessages({
  screenTitle: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.screenTitle',
    defaultMessage: 'Background Maps',
  },
  about: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.about',
    defaultMessage: 'About Custom Map',
  },
  description1: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.description1',
    defaultMessage:
      'Adding a custom map will enable you to see a map when you are offline.',
  },
  // TODO: Merge into description1 when https://github.com/digidem/comapeo-mobile/issues/669 is addressed
  description2: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.description2',
    defaultMessage:
      'Your custom map is not shared with other devices in your project.',
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

  const mapAddedBottomSheet = useBottomSheetModal({openOnMount: false});
  const removeMapBottomSheet = useBottomSheetModal({openOnMount: false});

  const selectCustomMapMutation = useSelectCustomMapFile();
  const importCustomMapMutation = useImportCustomMapFile();
  const removeCustomMapMutation = useRemoveCustomMapFile();
  const customMapInfoQuery = useGetCustomMapInfo();

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.aboutText}>{t(m.about)}</Text>
        <View style={styles.descriptionContainer}>
          <Text>{t(m.description1)}</Text>
          <Text>{t(m.description2)}</Text>
        </View>

        <CustomMapInfoSection
          onChooseFile={() => {
            selectCustomMapMutation.mutate(undefined, {
              onSuccess: asset => {
                if (!asset) return;

                importCustomMapMutation.mutate(
                  {
                    uri: asset.uri,
                  },
                  {
                    onError: () => {
                      FileSystem.deleteAsync(asset.uri, {
                        idempotent: true,
                      }).catch(noop);
                    },
                    onSuccess: () => {
                      mapAddedBottomSheet.openSheet();
                    },
                  },
                );
              },
            });
          }}
          onRemoveMap={() => {
            removeMapBottomSheet.openSheet();
          }}
        />

        {customMapInfoQuery.status === 'error' && (
          <>
            <Text style={styles.infoLoadErrorText}>
              {t(m.customMapInfoLoadError)}
            </Text>
            <Button
              fullWidth
              variant="outlined"
              onPress={() => {
                removeCustomMapMutation.mutate();
              }}>
              <Text style={styles.removeMapFileButtonText}>
                {t(m.removeMapFile)}
              </Text>
            </Button>
          </>
        )}
      </ScrollView>

      <BottomSheetModal
        ref={removeMapBottomSheet.sheetRef}
        isOpen={removeMapBottomSheet.isOpen}>
        <BottomSheetModalContent
          icon={<ErrorSvg />}
          title={t(m.deleteCustomMapTitle)}
          description={
            t(m.deleteCustomMapDescription) + '\n\n' + t(m.cannotBeUndone)
          }
          buttonConfigs={[
            {
              dangerous: true,
              variation: 'filled',
              text: t(m.deleteMapButtonText),
              icon: <MaterialIcon size={30} name="delete" color={WHITE} />,
              onPress: () => {
                removeCustomMapMutation.mutate();
                removeMapBottomSheet.closeSheet();
              },
            },
            {
              variation: 'outlined',
              text: t(m.close),
              onPress: () => {
                removeMapBottomSheet.closeSheet();
              },
            },
          ]}
        />
      </BottomSheetModal>

      <BottomSheetModal
        fullScreen
        ref={mapAddedBottomSheet.sheetRef}
        isOpen={mapAddedBottomSheet.isOpen}>
        <BottomSheetModalContent
          icon={<GreenCheckSvg />}
          title={t(m.customMapAddedTitle)}
          description={t(m.customMapAddedDescription)}
          buttonConfigs={[
            {
              variation: 'outlined',
              text: t(m.close),
              onPress: () => {
                mapAddedBottomSheet.closeSheet();
              },
            },
          ]}
        />
      </BottomSheetModal>

      <ErrorBottomSheet
        error={
          removeCustomMapMutation.error ||
          selectCustomMapMutation.error ||
          importCustomMapMutation.error
        }
        title={
          selectCustomMapMutation.error || importCustomMapMutation.error
            ? m.importErrorTitle
            : undefined
        }
        description={
          selectCustomMapMutation.error || importCustomMapMutation.error
            ? m.importErrorDesciption
            : undefined
        }
        clearError={() => {
          if (removeCustomMapMutation.error) {
            removeCustomMapMutation.reset();
          }
          if (selectCustomMapMutation.error) {
            selectCustomMapMutation.reset();
          }
          if (importCustomMapMutation.error) {
            importCustomMapMutation.reset();
          }
        }}
      />
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
  aboutText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 36,
    color: DARK_GREY,
  },
  infoLoadErrorText: {
    textAlign: 'center',
    color: RED,
    fontSize: 20,
  },
  removeMapFileButton: {
    backgroundColor: RED,
  },
  removeMapFileButtonText: {
    fontWeight: '700',
    letterSpacing: 0.5,
    fontSize: 18,
    color: RED,
  },
});
