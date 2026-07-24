import {type NativeStackNavigationOptions} from '@react-navigation/native-stack';
import React from 'react';
import {defineMessages, useIntl, type MessageDescriptor} from 'react-intl';
import {ScrollView, StyleSheet, View} from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {File} from 'expo-file-system';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';

import {FILE_SELECT_MUTATION_KEY} from '../../hooks/files';
import {
  useImportCustomMapFile,
  useGetCustomMapInfo,
  useRemoveCustomMapFile,
  isHTTPError,
} from '@comapeo/core-react';
import StackSvg from '../../images/Stack.svg';
import {
  RED,
  DARK_GREY,
  NEW_DARK_GREY,
  VERY_LIGHT_GREY,
  BLUE_GREY,
} from '../../lib/styles';
import {FullScreenCenteredLoader} from '../../sharedComponents/FullScreenCenteredLoader';
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
import {DownloadIcon} from '../../sharedComponents/icons';
import {useMutation} from '@tanstack/react-query';

const m = defineMessages({
  screenTitle: {
    id: '$1screens.Settings.MapManagement.BackgroundMaps.screenTitle',
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
  importErrorTitle: {
    id: '$1screens.Settings.MapManagement.BackgroundMaps.importErrorTitle',
    defaultMessage: 'Import Error',
  },
  importErrorDesciption: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.importErrorDescription',
    defaultMessage: 'Unable to import the file. Please go back and try again.',
  },
  sendMap: {
    id: '$1screens.Settings.MapManagement.BackgroundMaps.sendMap',
    defaultMessage: 'Send Map',
  },
  removeMap: {
    id: '$1screens.Settings.MapManagement.BackgroundMaps.removeMap',
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
    id: '$1screens.Settings.MapManagement.BackgroundMaps.chooseFile',
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

  const selectFileMutation = useMutation({
    mutationKey: FILE_SELECT_MUTATION_KEY,
    mutationFn: async () => {
      const result = await File.pickFileAsync(undefined, 'application/*');
      // The return type of `File.pickFileAsync()` is incorrect. See https://github.com/expo/expo/issues/43201
      const file = (Array.isArray(result) ? result[0] : result) as File;
      if (!file) {
        throw new Error('No file selected');
      }
      await importCustomMapMutation.mutateAsync({file});
    },
  });
  const importCustomMapMutation = useImportCustomMapFile();
  const removeCustomMapMutation = useRemoveCustomMapFile();
  const {
    data: customMapInfo,
    isRefetching,
    status: mapInfoStatus,
    error: mapInfoError,
  } = useGetCustomMapInfo();

  const handleChooseFile = () => {
    selectFileMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('MapAddedBottomSheet');
      },
      onError: err => {
        if (
          err instanceof Error &&
          // Error message from expo-file-system's File.pickFileAsync() when user cancels
          err.message.includes('cancelled by the user')
        ) {
          return;
        }
        Sentry.captureException(err);
        navigate('BackgroundMapErrorBottomSheet', {
          title: t(m.importErrorTitle),
          description: t(m.importErrorDesciption),
        });
      },
    });
  };

  const handleRemoveMap = () => {
    navigate('DeleteCustomMapBottomSheet');
  };

  const isUploading = selectFileMutation.isPending;

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {isRefetching || mapInfoStatus === 'pending' ? (
          <FullScreenCenteredLoader />
        ) : mapInfoStatus !== 'success' || !customMapInfo ? (
          <NoMapScreen
            error={mapInfoError}
            onChooseFile={handleChooseFile}
            isUploading={isUploading}
            onRemoveMapFile={() => {
              removeCustomMapMutation.mutate(undefined, {
                onError: err => {
                  Sentry.captureException(err);
                  navigate('ErrorBottomSheet', {error: err});
                },
              });
            }}
          />
        ) : (
          <MapInfoScreen
            customMapInfo={customMapInfo}
            onRemoveMap={handleRemoveMap}
          />
        )}
      </ScrollView>
    </>
  );
}

function NoMapScreen({
  error,
  onChooseFile,
  isUploading,
  onRemoveMapFile,
}: {
  error: Error | null;
  onChooseFile: () => void;
  isUploading: boolean;
  onRemoveMapFile: () => void;
}) {
  const {formatMessage: t} = useIntl();

  return (
    <View style={{marginTop: 20}}>
      <View style={styles.descriptionContainer}>
        <BodyText>{t(m.description1)}</BodyText>
        <BodyText>{t(m.description2)}</BodyText>
      </View>
      <View style={{gap: 20, marginTop: 40, alignItems: 'center'}}>
        {isUploading ? (
          <LoadingIndicator size="large" />
        ) : (
          <SecondaryButton
            fullSize
            text={t(m.chooseFile)}
            onPress={onChooseFile}
            renderIcon={({color, size}) => (
              <DownloadIcon size={size} color={color} />
            )}
          />
        )}
        <BodyText variant="smallMeta" style={styles.fileTypeText}>
          {t(m.acceptedFileTypes)}
        </BodyText>
      </View>
      {error && isHTTPError(error) && error.code !== 'MAP_NOT_FOUND' && (
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
            navigate('SelectMapShareDevice');
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
  fileTypeText: {
    textAlign: 'center',
    color: NEW_DARK_GREY,
  },
});
