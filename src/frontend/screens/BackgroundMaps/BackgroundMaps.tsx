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
import StackSvg from '../../images/Stack.svg';
import {
  RED,
  DARK_GREY,
  NEW_DARK_GREY,
  VERY_LIGHT_GREY,
  BLUE_GREY,
} from '../../lib/styles';
import {Loading} from '../../sharedComponents/Loading';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import * as Sentry from '@sentry/react-native';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {
  SecondaryButton,
  DestructiveButton,
  SecondaryDestructiveButton,
} from '../../sharedComponents/Buttons';
import {bytesToMegabytes} from '../../lib/bytesToMegabytes';
import {Button} from '../../sharedComponents/Button';
import {DownloadIcon} from '../../sharedComponents/icons';

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
  chooseFile: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.chooseFile',
    defaultMessage: 'Choose File',
  },
  acceptedFileTypes: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.acceptedFileTypes',
    defaultMessage: 'Accepted file types are .smp',
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
  };

  const handleRemoveMap = () => {
    navigate('DeleteCustomMapBottomSheet');
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
                  navigate('ErrorBottomSheet', {error: err});
                },
              });
            }}
          />
        )}
      </ScrollView>
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
    <View style={{marginTop: 20}}>
      <View style={styles.descriptionContainer}>
        <BodyText>{t(m.description1)}</BodyText>
        <BodyText>{t(m.description2)}</BodyText>
      </View>
      <View style={{gap: 20, marginTop: 40}}>
        <Button fullWidth variant="outlined" onPress={onChooseFile}>
          <View style={styles.buttonContentContainer}>
            <DownloadIcon size={24} />
            <View>
              <HeaderText variant="header5" style={styles.buttonTextBase}>
                {t(m.chooseFile)}
                <HeaderText variant="header5" style={styles.asteriskText}>
                  {' '}
                  *
                </HeaderText>
              </HeaderText>
            </View>
          </View>
        </Button>
        <BodyText variant="smallMeta" style={styles.fileTypeText}>
          {t(m.acceptedFileTypes)}
        </BodyText>
      </View>
      {error && (
        <View style={{marginTop: 40}}>
          <BodyText variant="large" style={styles.infoLoadErrorText}>
            {t(m.customMapInfoLoadError)}
          </BodyText>
          <View style={{alignItems: 'center', marginTop: 20}}>
            <SecondaryDestructiveButton
              fullSize
              text={t(m.removeMapFile)}
              onPress={onRemoveMapFile}
            />
          </View>
        </View>
      )}
    </View>
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
            // navigate('SelectMapShareDevice');
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
    paddingVertical: 20,
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
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonTextBase: {
    letterSpacing: 0.5,
  },
  asteriskText: {
    color: RED,
  },
  fileTypeText: {
    textAlign: 'center',
    color: NEW_DARK_GREY,
  },
});
