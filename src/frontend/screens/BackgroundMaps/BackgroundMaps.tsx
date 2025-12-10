import {type NativeStackNavigationOptions} from '@react-navigation/native-stack';
import React from 'react';
import {defineMessages, useIntl, type MessageDescriptor} from 'react-intl';
import {ScrollView, StyleSheet, View} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {useSelectFile} from '../../hooks/files';
import {
  useGetCustomMapInfo,
  useImportCustomMapFile,
  useRemoveCustomMapFile,
} from '../../hooks/server/maps';
import ErrorSvg from '../../images/Error.svg';
import GreenCheckSvg from '../../images/Success.svg';
import StackSvg from '../../images/Stack.svg';
import {
  RED,
  WHITE,
  DARK_GREY,
  NEW_DARK_GREY,
  VERY_LIGHT_GREY,
  BLUE_GREY,
} from '../../lib/styles';
import {
  BottomSheetModal,
  BottomSheetModalContent,
  useBottomSheetModal,
} from '../../sharedComponents/BottomSheetModal';
import {Loading} from '../../sharedComponents/Loading';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {ChooseMapFile} from './ChooseMapFile';
import * as Sentry from '@sentry/react-native';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {
  SecondaryButton,
  DestructiveButton,
} from '../../sharedComponents/Buttons';
import {bytesToMegabytes} from '../../lib/bytesToMegabytes';

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
  sendMap: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.sendMap',
    defaultMessage: 'Send Map',
  },
  removeMap: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.removeMap',
    defaultMessage: 'Remove Map',
  },
  addedOn: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.addedOn',
    defaultMessage: 'Added on {date}',
  },
  megabytes: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.megabytes',
    defaultMessage: '{size} MB',
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
  const mapAddedBottomSheet = useBottomSheetModal({openOnMount: false});
  const removeMapBottomSheet = useBottomSheetModal({openOnMount: false});

  const selectFileMutation = useSelectFile();
  const importCustomMapMutation = useImportCustomMapFile();
  const removeCustomMapMutation = useRemoveCustomMapFile();
  const customMapInfoQuery = useGetCustomMapInfo();

  const handleChooseFile = () => {
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
                mapAddedBottomSheet.openSheet();
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
  };

  const handleRemoveMap = () => {
    removeMapBottomSheet.openSheet();
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {customMapInfoQuery.isPending ? (
          <Loading size={10} />
        ) : customMapInfoQuery.data ? (
          <MapInfoScreen
            customMapInfo={customMapInfoQuery.data}
            onRemoveMap={handleRemoveMap}
          />
        ) : (
          <NoMapScreen
            error={customMapInfoQuery.error}
            onChooseFile={handleChooseFile}
            onRemoveMapFile={() => {
              removeCustomMapMutation.mutate(undefined, {
                onError: err => {
                  Sentry.captureException(err);
                  navigate('ErrorBottomSheet');
                },
              });
            }}
          />
        )}
      </ScrollView>

      <BottomSheetModal
        ref={removeMapBottomSheet.sheetRef}
        isOpen={removeMapBottomSheet.isOpen}>
        <BottomSheetModalContent
          loading={removeCustomMapMutation.isPending}
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
                removeCustomMapMutation.mutate(undefined, {
                  onSuccess: () => {
                    removeMapBottomSheet.closeSheet();
                  },
                });
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
          icon={
            <GreenCheckSvg
              style={{
                marginTop: 80,
              }}
            />
          }
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
    </>
  );
}

function NoMapScreen({
  error,
  onChooseFile,
  onRemoveMapFile,
}: {
  error: Error | null;
  onChooseFile: () => void;
  onRemoveMapFile: () => void;
}) {
  const {formatMessage: t} = useIntl();

  return (
    <>
      <View style={styles.descriptionContainer}>
        <BodyText>{t(m.description1)}</BodyText>
        <BodyText>{t(m.description2)}</BodyText>
      </View>
      <ChooseMapFile onChooseFile={onChooseFile} />
      {error && (
        <>
          <BodyText variant="large" style={styles.infoLoadErrorText}>
            {t(m.customMapInfoLoadError)}
          </BodyText>
          <DestructiveButton
            fullSize
            text={t(m.removeMapFile)}
            onPress={onRemoveMapFile}
            renderIcon={({color, size}) => (
              <MaterialIcon name="delete" size={size} color={color} />
            )}
          />
        </>
      )}
    </>
  );
}

function MapInfoScreen({
  customMapInfo,
  onRemoveMap,
}: {
  customMapInfo: NonNullable<ReturnType<typeof useGetCustomMapInfo>['data']>;
  onRemoveMap: () => void;
}) {
  const {formatMessage: t} = useIntl();
  const {navigate} = useNavigationFromRoot();

  const calculatedSize = customMapInfo.size
    ? bytesToMegabytes(customMapInfo.size).toFixed(0)
    : undefined;
  const displayedSize =
    calculatedSize === undefined
      ? undefined
      : parseInt(calculatedSize, 10) < 1
        ? '<1'
        : calculatedSize;

  return (
    <View style={styles.hasMapContainer}>
      <View style={styles.cardContainer}>
        <View style={styles.centerStuff}>
          <View style={styles.iconBackground}>
            <StackSvg width={47} height={50} color={DARK_GREY} />
          </View>

          <HeaderText variant="header2" style={styles.mapName}>
            {customMapInfo.name}
          </HeaderText>

          <View style={styles.sizeContainer}>
            <StackSvg width={19} height={20} color={NEW_DARK_GREY} />
            <HeaderText variant="header4">
              {displayedSize !== undefined &&
                t(m.megabytes, {size: displayedSize})}
            </HeaderText>
          </View>
        </View>

        <BodyText style={styles.dateText}>
          {t(m.addedOn, {
            date: new Intl.DateTimeFormat(undefined, {
              year: 'numeric',
              month: 'long',
              day: '2-digit',
            }).format(customMapInfo.created),
          })}
        </BodyText>

        <SecondaryButton
          fullSize
          text={t(m.sendMap)}
          onPress={() => {
            // TODO: Get the actual mapId from the map info once the backend provides it
            navigate('SelectMapShareDevice', {
              mapId: 'default',
            });
          }}
          renderIcon={({color, size}) => (
            <MaterialIcon name="send" size={size} color={color} />
          )}
        />
      </View>

      <DestructiveButton
        fullSize
        text={t(m.removeMap)}
        onPress={onRemoveMap}
        renderIcon={({color, size}) => (
          <MaterialIcon name="delete" size={size} color={color} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 36,
    flexGrow: 1,
  },
  descriptionContainer: {
    gap: 20,
  },
  infoLoadErrorText: {
    textAlign: 'center',
    color: RED,
  },
  hasMapContainer: {
    flex: 1,
    gap: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  cardContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderColor: BLUE_GREY,
    borderWidth: 1,
    borderRadius: 10,
    flex: 1,
  },
  centerStuff: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: VERY_LIGHT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapName: {
    textAlign: 'center',
    color: DARK_GREY,
  },
  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  dateText: {
    textAlign: 'center',
    color: NEW_DARK_GREY,
    flex: 1,
  },
});
