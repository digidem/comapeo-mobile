import {useDocumentCreatedBy, useSingleDocByDocId} from '@comapeo/core-react';
import type {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {captureException, ErrorBoundary} from '@sentry/react-native';
import type {ImageLoadEventData} from 'expo-image';
import {Suspense, useState} from 'react';
import {
  defineMessages,
  useIntl,
  type IntlShape,
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
import type {PhotoLayout} from '../../lib/exif.ts';
import {getExpoImageStorageSize} from '../../lib/file-system.ts';
import {getAttachmentPhotoInfo, getDraftPhotoInfo} from '../../lib/photos.ts';
import {
  BLACK,
  BLUE_GREY,
  DARK_GREY,
  NEW_DARK_GREY,
  WHITE,
} from '../../lib/styles.ts';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft.tsx';
import {CoreBlobImage} from '../../sharedComponents/Images/CoreBlobImage.tsx';
import {ImageErrorPlaceholder} from '../../sharedComponents/Images/ImageErrorPlaceholder.tsx';
import {BodyText} from '../../sharedComponents/Text/BodyText.tsx';
import type {NativeRootNavigationProps} from '../../sharedTypes/navigation.ts';
import {ImageWithErrorFallback} from './ImageWithErrorFallback.tsx';
import {InfoItem} from './InfoItem.tsx';
import {Accordian} from '../../sharedComponents/Accordian.tsx';

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

  const [imageLoadInfo, setImageLoadInfo] = useState<
    {height: number; width: number; storageSize?: number} | undefined
  >(undefined);

  const photoInfo =
    photo.type === 'photo'
      ? getAttachmentPhotoInfo(photo)
      : getDraftPhotoInfo(photo);

  const deviceDetailsText = getDeviceDetailsText({
    make: photoInfo.make,
    model: photoInfo.model,
  });

  const cameraDetailsText = getCameraDetailsText(
    {fNumber: photoInfo.fNumber, layout: photoInfo.layout},
    t,
  );

  // Uses the EXIF information if possible and falls back to the image load info if needed
  const photoDimensions =
    typeof photoInfo.height === 'number' && typeof photoInfo.width === 'number'
      ? {
          height: photoInfo.height,
          width: photoInfo.width,
        }
      : typeof imageLoadInfo?.height === 'number' &&
          typeof imageLoadInfo?.width === 'number'
        ? {
            height: imageLoadInfo.height,
            width: imageLoadInfo.width,
          }
        : undefined;

  const photoDetailsText = photoDimensions
    ? getPhotoDetailsText(
        {...photoDimensions, storageSize: imageLoadInfo?.storageSize},
        t,
      )
    : null;

  async function onImageLoad(event: ImageLoadEventData) {
    try {
      const storageSize = await getExpoImageStorageSize(event.source.url);

      setImageLoadInfo({
        height: event.source.height,
        width: event.source.width,
        storageSize,
      });
    } catch (err) {
      captureException(err);

      setImageLoadInfo({
        height: event.source.height,
        width: event.source.width,
      });
    }
  }

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
                  onLoad={onImageLoad}
                />
              </ErrorBoundary>
            </View>
          </Suspense>
        ) : (
          <View style={{flex: 1, borderRadius: 10, overflow: 'hidden'}}>
            <ImageWithErrorFallback
              source={photo.originalUri}
              onLoad={onImageLoad}
            />
          </View>
        )}
      </View>
      <View style={{gap: 20}}>
        {!photoInfo.external && (
          <View
            style={{
              flex: 1,
              padding: 20,
              borderColor: DARK_GREY,
              borderWidth: 1,
              borderRadius: 10,
            }}>
            <Accordian
              title={
                <View style={{flexDirection: 'row', gap: 12}}>
                  <Octicons
                    name="check-circle"
                    size={20}
                    color={NEW_DARK_GREY}
                    allowFontScaling
                  />
                  <BodyText selectable style={styles.primaryInfoText}>
                    {t(m.validatedByCoMapeo)}
                  </BodyText>
                </View>
              }
              innerAccordianDetails={
                <>
                  {'createdAt' in photoInfo && (
                    <BodyText selectable style={styles.primaryInfoText}>
                      {photoInfo.createdAt}
                    </BodyText>
                  )}
                  {'coordinates' in photoInfo && (
                    <BodyText selectable style={styles.primaryInfoText}>
                      {photoInfo.coordinates?.latitude}
                    </BodyText>
                  )}
                </>
              }
            />
          </View>
        )}

        {photoInfo.createdAt !== undefined && (
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
              {formatDate(photoInfo.createdAt, {
                dateStyle: 'full',
              })}
            </BodyText>

            <BodyText selectable style={styles.secondaryInfoText}>
              {formatTime(photoInfo.createdAt, {
                timeStyle: 'short',
              })}
            </BodyText>
          </InfoItem>
        )}

        {photoInfo.coordinates && (
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
                lon: photoInfo.coordinates.longitude,
                lat: photoInfo.coordinates.latitude,
                format: coordinateFormat,
              })}
            </BodyText>
          </InfoItem>
        )}

        {(deviceDetailsText || cameraDetailsText || photoDetailsText) && (
          <InfoItem
            icon={
              <MaterialIcons
                name="camera"
                size={20}
                color={NEW_DARK_GREY}
                allowFontScaling
              />
            }>
            {deviceDetailsText && (
              <BodyText selectable style={styles.primaryInfoText}>
                {deviceDetailsText}
              </BodyText>
            )}

            {cameraDetailsText && (
              <BodyText selectable style={styles.secondaryInfoText}>
                {cameraDetailsText}
              </BodyText>
            )}

            {photoDetailsText && (
              <BodyText selectable style={styles.secondaryInfoText}>
                {photoDetailsText}
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
    layout,
  }: {
    fNumber?: number;
    layout?: PhotoLayout;
  },
  formatMessage: IntlShape['formatMessage'],
): string | null {
  const displayedParts: Array<string> = [];

  if (layout) {
    displayedParts.push(
      layout === 'horizontal'
        ? formatMessage(m.landscape)
        : formatMessage(m.portrait),
    );
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
