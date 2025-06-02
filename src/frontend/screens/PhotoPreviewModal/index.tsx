import {useDocumentCreatedBy, useSingleDocByDocId} from '@comapeo/core-react';
import type {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {captureException, ErrorBoundary} from '@sentry/react-native';
import {Suspense, useState} from 'react';
import {
  defineMessages,
  type IntlShape,
  useIntl,
  type MessageDescriptor,
} from 'react-intl';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import {useActiveProject} from '../../contexts/ActiveProjectContext.tsx';
import {useCoordinateFormat} from '../../contexts/CoordinateFormatStoreContext.ts';
import {useAppLanguageTag} from '../../hooks/useAppLanguageTag.ts';
import {bytesToMegabytes} from '../../lib/bytesToMegabytes.ts';
import {formatCoords} from '../../lib/coordinateFormat.ts';
import {getPhotoLayout} from '../../lib/exif.ts';
import {getExpoImageStorageSize} from '../../lib/file-system.ts';
import {BLACK, BLUE_GREY, NEW_DARK_GREY, WHITE} from '../../lib/styles.ts';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft.tsx';
import {CoreBlobImage} from '../../sharedComponents/Images/CoreBlobImage.tsx';
import {ImageErrorPlaceholder} from '../../sharedComponents/Images/ImageErrorPlaceholder.tsx';
import {BodyText} from '../../sharedComponents/Text/BodyText.tsx';
import type {NativeRootNavigationProps} from '../../sharedTypes/navigation.ts';
import {ImageWithErrorFallback} from './ImageWithErrorFallback.tsx';
import {InfoItem} from './InfoItem.tsx';

const m = defineMessages({
  navTitle: {
    id: 'screens.PhotoPreviewModal.navTitle',
    defaultMessage: 'Photo Info',
  },
  validatedByCoMapeo: {
    id: 'screens.PhotoPreviewModal.validatedByCoMapeo',
    defaultMessage: 'Validated by CoMapeo',
  },
  headerDeleteButtonText: {
    id: 'screens.PhotoPreviewModal.headerButtonText',
    defaultMessage: 'Delete Photo',
  },
  imageStorageSize: {
    id: 'screens.PhotoPreviewModal.imageStorageSize',
    defaultMessage: '{value} MB',
    description: 'Image size in megabytes',
  },
  landscape: {
    id: 'screens.PhotoPreviewModal.landscape',
    defaultMessage: 'Landscape',
    description: 'Describes image layout when taking photo horizontally',
  },
  portrait: {
    id: 'screens.PhotoPreviewModal.portrait',
    defaultMessage: 'Portrait',
    description: 'Describes image layout when taking photo vertically',
  },
});

export function PhotoPreviewModal({
  route,
}: NativeRootNavigationProps<'PhotoPreviewModal'>) {
  const {observationDocId, photo} = route.params;
  const {projectId} = useActiveProject();
  const {formatMessage: t, formatDate, formatTime} = useIntl();

  const coordinateFormat = useCoordinateFormat();

  // TODO: This check needs to be updated in the case of the saved photo using attachment fields that will
  // be available in an unreleased version of core.
  const isValidatedByCoMapeo =
    photo.type === 'photo'
      ? true
      : typeof photo.mediaMetadata.timestamp === 'number' &&
        photo.mediaMetadata;

  const exif =
    photo.type === 'photo' ? photo.photoExif : photo.mediaMetadata.photoExif;

  const [imageStorageSize, setImageStorageSize] = useState<number | undefined>(
    undefined,
  );

  // TODO: For saved photo, use attachment's `createdAt` field (available in unreleased version of core)
  const timestamp =
    photo.type === 'processed' ? photo.mediaMetadata.timestamp : undefined;

  const coordinates =
    photo.type === 'processed' && photo.mediaMetadata.location
      ? {
          lon: photo.mediaMetadata.location.coords.longitude,
          lat: photo.mediaMetadata.location.coords.latitude,
        }
      : photo.type === 'photo'
        ? // TODO: Use attachment's `position` field (not yet implemented in schema)
          undefined
        : undefined;

  const deviceDetails = exif
    ? getDeviceDetailsText({make: exif.Make, model: exif.Model})
    : null;

  const cameraDetails = exif
    ? getCameraDetailsText(
        {
          // @ts-expect-error Need to update schema
          fNumber: exif.FNumber,
          orientation: exif.Orientation,
        },
        t,
      )
    : null;

  const photoDetails =
    typeof exif?.ImageWidth === 'number' &&
    typeof exif?.ImageLength === 'number'
      ? getPhotoDetailsText(
          {
            width: exif.ImageWidth,
            height: exif.ImageLength,
            storageSize: imageStorageSize,
          },
          t,
        )
      : null;

  return (
    <ScrollView contentContainerStyle={{padding: 20, gap: 20}}>
      <View>
        {photo.type === 'photo' ? (
          <Suspense fallback={null}>
            <View style={{flex: 1, borderRadius: 10, overflow: 'hidden'}}>
              <ErrorBoundary fallback={() => <ImageErrorPlaceholder />}>
                <CoreBlobImage
                  driveId={photo.driveDiscoveryId}
                  name={photo.name}
                  projectId={projectId}
                  onLoad={event => {
                    getExpoImageStorageSize(event.source.url)
                      .then(size => {
                        setImageStorageSize(size);
                      })
                      .catch(err => {
                        captureException(err);
                      });
                  }}
                />
              </ErrorBoundary>
            </View>
          </Suspense>
        ) : (
          <View style={{flex: 1, borderRadius: 10, overflow: 'hidden'}}>
            <ImageWithErrorFallback
              source={photo.originalUri}
              onLoad={event => {
                getExpoImageStorageSize(event.source.url)
                  .then(size => {
                    setImageStorageSize(size);
                  })
                  .catch(err => {
                    captureException(err);
                  });
              }}
            />
          </View>
        )}
      </View>
      <View style={{gap: 20}}>
        {isValidatedByCoMapeo && (
          <InfoItem
            icon={
              <Octicons
                name="check-circle"
                size={20}
                color={NEW_DARK_GREY}
                allowFontScaling
              />
            }>
            <BodyText selectable style={styles.primaryInfoText}>
              {t(m.validatedByCoMapeo)}
            </BodyText>
          </InfoItem>
        )}

        {timestamp !== undefined && (
          <InfoItem
            icon={
              <Octicons
                name="calendar"
                size={20}
                color={NEW_DARK_GREY}
                allowFontScaling
              />
            }>
            <BodyText selectable style={styles.primaryInfoText}>
              {formatDate(timestamp, {
                dateStyle: 'full',
              })}
            </BodyText>

            <BodyText selectable style={styles.secondaryInfoText}>
              {formatTime(timestamp, {
                timeStyle: 'short',
              })}
            </BodyText>
          </InfoItem>
        )}

        {coordinates && (
          <InfoItem
            icon={
              <Octicons
                name="location"
                size={20}
                color={NEW_DARK_GREY}
                allowFontScaling
              />
            }>
            <BodyText selectable style={styles.primaryInfoText}>
              {formatCoords({
                lon: coordinates.lon,
                lat: coordinates.lat,
                format: coordinateFormat,
              })}
            </BodyText>
          </InfoItem>
        )}

        {(deviceDetails || cameraDetails || photoDetails) && (
          <InfoItem
            icon={
              <MaterialIcons
                name="camera"
                size={20}
                color={NEW_DARK_GREY}
                allowFontScaling
              />
            }>
            {deviceDetails && (
              <BodyText selectable style={styles.primaryInfoText}>
                {deviceDetails}
              </BodyText>
            )}

            {cameraDetails && (
              <BodyText selectable style={styles.secondaryInfoText}>
                {cameraDetails}
              </BodyText>
            )}

            {photoDetails && (
              <BodyText selectable style={styles.secondaryInfoText}>
                {photoDetails}
              </BodyText>
            )}
          </InfoItem>
        )}

        {observationDocId && (
          <InfoItem
            icon={
              <MaterialIcons
                name="numbers"
                size={20}
                color={NEW_DARK_GREY}
                allowFontScaling
              />
            }>
            <BodyText selectable style={styles.primaryInfoText}>
              {
                // TODO: Showing this ID is a temporary measure
                // Ideally we use a format that is more human readable/friendly
                observationDocId.slice(0, 15)
              }
            </BodyText>
          </InfoItem>
        )}

        {observationDocId && (
          <ErrorBoundary>
            <Suspense fallback={null}>
              <CreatedByDeviceIdInfoItem
                projectId={projectId}
                observationDocId={observationDocId}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  primaryInfoText: {
    color: WHITE,
    flexWrap: 'wrap',
  },
  secondaryInfoText: {
    color: BLUE_GREY,
    flexWrap: 'wrap',
  },
});

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return ({
    navigation,
    route,
  }: NativeRootNavigationProps<'PhotoPreviewModal'>): NativeStackNavigationOptions => {
    return {
      headerTitle: intl(m.navTitle),
      headerTitleStyle: {color: WHITE},
      headerStyle: {backgroundColor: BLACK},
      contentStyle: {backgroundColor: BLACK},
      headerLeft: headerLeftProps => (
        <CustomHeaderLeft
          tintColor={WHITE}
          headerBackButtonProps={headerLeftProps}
        />
      ),
      headerRight: () => {
        const {photo} = route.params;

        return photo.type === 'processed' ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ConfirmDeletePhoto', {
                photo,
                onSuccess: () => {
                  navigation.goBack();
                },
              });
            }}
            style={{
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: WHITE,
              borderRadius: 24,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 8,
              paddingVertical: 6,
            }}>
            <MaterialIcons name="delete" size={18} color={WHITE} />
            <Text style={{marginLeft: 4, color: WHITE, fontSize: 13}}>
              {intl(m.headerDeleteButtonText)}
            </Text>
          </TouchableOpacity>
        ) : null;
      },
    };
  };
}

function CreatedByDeviceIdInfoItem({
  projectId,
  observationDocId,
}: {
  projectId: string;
  observationDocId: string;
}) {
  const lang = useAppLanguageTag();

  const {data: observation} = useSingleDocByDocId({
    projectId,
    docType: 'observation',
    docId: observationDocId,
    lang,
  });

  const {data: createdByDeviceId} = useDocumentCreatedBy({
    projectId,
    originalVersionId: observation.originalVersionId,
  });

  return (
    <InfoItem
      icon={
        <MaterialIcons
          name="devices"
          size={20}
          color={NEW_DARK_GREY}
          allowFontScaling
        />
      }>
      <BodyText selectable style={styles.primaryInfoText} numberOfLines={1}>
        {
          // TODO: Showing this ID is a temporary measure
          // Ideally we use a format that is more human readable/friendly
          createdByDeviceId.slice(0, 15)
        }
      </BodyText>
    </InfoItem>
  );
}

function getDeviceDetailsText({make, model}: {make?: string; model?: string}) {
  const displayedParts: Array<string> = [];

  if (make) {
    displayedParts.push(make);
  }

  if (model) {
    displayedParts.push(model);
  }

  if (displayedParts.length === 0) {
    return null;
  }

  return displayedParts.join(' ');
}

function getCameraDetailsText(
  {
    fNumber,
    orientation,
  }: {
    fNumber?: number;
    orientation?: number;
  },
  formatMessage: IntlShape['formatMessage'],
): string | null {
  const displayedParts: Array<string> = [];

  if (typeof orientation === 'number') {
    try {
      const layout = getPhotoLayout(orientation);

      displayedParts.push(
        layout === 'horizontal'
          ? formatMessage(m.landscape)
          : formatMessage(m.portrait),
      );
    } catch (err) {
      captureException(err);

      // TODO: What happens if layout cannot be determined or is missing?
      // Should we still try to display something?
    }
  }

  if (typeof fNumber === 'number') {
    displayedParts.push(`𝒇 ${fNumber}`);
  }

  if (displayedParts.length === 0) {
    return null;
  }

  return displayedParts.join(' — ');
}

function getPhotoDetailsText(
  {
    width,
    height,
    storageSize,
  }: {
    width: number;
    height: number;
    storageSize?: number;
  },
  formatMessage: IntlShape['formatMessage'],
): string | null {
  const displayedParts: Array<string> = [];

  // TODO: Should this be translated?
  displayedParts.push(`${width} x ${height}`);

  if (typeof storageSize === 'number') {
    displayedParts.push(
      formatMessage(m.imageStorageSize, {
        value: Math.max(bytesToMegabytes(storageSize), 0.01).toFixed(2),
      }),
    );
  }

  if (displayedParts.length === 0) {
    return null;
  }

  return displayedParts.join(' • ');
}
