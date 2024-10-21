import {type NativeStackNavigationOptions} from '@react-navigation/native-stack';
import React from 'react';
import {defineMessages, useIntl, type MessageDescriptor} from 'react-intl';
import {ScrollView, StyleSheet, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

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
import {ErrorBottomSheet} from '../../../sharedComponents/ErrorBottomSheet';
import {Loading} from '../../../sharedComponents/Loading';
import {Text} from '../../../sharedComponents/Text';
import {type NativeRootNavigationProps} from '../../../sharedTypes/navigation';
import {ChooseMapFile} from './ChooseMapFile';
import {CustomMapDetails} from './CustomMapDetails';

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
      'Could not get custom map information. Please choose a different file.',
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

  let renderedMapInfo;

  switch (customMapInfoQuery.status) {
    case 'pending': {
      renderedMapInfo = <Loading size={10} />;

      break;
    }
    case 'error': {
      // TODO: Should surface error info better and also provide option to replace/remove map
      renderedMapInfo = (
        <>
          <ChooseMapFile
            onChooseFile={() => {
              selectCustomMapMutation.mutate(undefined, {
                onSuccess: asset => {
                  if (!asset) return;

                  return importCustomMapMutation.mutateAsync(
                    {
                      uri: asset.uri,
                    },
                    {
                      onSuccess: () => {
                        mapAddedBottomSheet.openSheet();
                      },
                    },
                  );
                },
              });
            }}
          />
          <Text style={styles.infoLoadErrorText}>
            {t(m.customMapInfoLoadError)}
          </Text>
        </>
      );

      break;
    }
    case 'success': {
      if (customMapInfoQuery.isFetching) {
        renderedMapInfo = customMapInfoQuery.data ? (
          <CustomMapDetails
            loading
            name={customMapInfoQuery.data.name}
            dateAdded={customMapInfoQuery.data.created}
            size={customMapInfoQuery.data.size}
            onRemove={() => {
              removeMapBottomSheet.openSheet();
            }}
          />
        ) : (
          <Loading size={10} />
        );
      } else {
        renderedMapInfo = customMapInfoQuery.data ? (
          <CustomMapDetails
            name={customMapInfoQuery.data.name}
            dateAdded={customMapInfoQuery.data.created}
            size={customMapInfoQuery.data.size}
            onRemove={() => {
              removeMapBottomSheet.openSheet();
            }}
          />
        ) : (
          <ChooseMapFile
            onChooseFile={() => {
              selectCustomMapMutation.mutate(undefined, {
                onSuccess: asset => {
                  if (!asset) return;

                  return importCustomMapMutation.mutateAsync(
                    {
                      uri: asset.uri,
                    },
                    {
                      onSuccess: () => {
                        mapAddedBottomSheet.openSheet();
                      },
                    },
                  );
                },
              });
            }}
          />
        );
      }

      break;
    }
  }
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.aboutText}>{t(m.about)}</Text>
        <View style={styles.descriptionContainer}>
          <Text>{t(m.description1)}</Text>
          <Text>{t(m.description2)}</Text>
        </View>
        {renderedMapInfo}
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
        error={removeCustomMapMutation.error || selectCustomMapMutation.error}
        clearError={() => {
          if (removeCustomMapMutation.error) {
            removeCustomMapMutation.reset();
          }
          if (selectCustomMapMutation.error) {
            selectCustomMapMutation.reset();
          }
        }}
      />
    </>
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
});
