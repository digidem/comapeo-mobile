import type {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {captureException, ErrorBoundary} from '@sentry/react-native';
import type {ImageLoadEventData} from 'expo-image';
import React, {useState} from 'react';
import {defineMessages, useIntl, type MessageDescriptor} from 'react-intl';
import {ScrollView, View} from 'react-native';
import {getExpoImageStorageSize} from '../../lib/file-system.ts';
import {getAttachmentPhotoInfo} from '../../lib/photos.ts';
import {BLACK, NEW_DARK_GREY, WHITE} from '../../lib/styles.ts';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft.tsx';
import type {NativeRootNavigationProps} from '../../sharedTypes/navigation.ts';
import {
  CoordinateInfoItem,
  CreatedAtInfoItem,
  DeviceCameraPhotoInfoItem,
  InfoItem,
} from './InfoItem.tsx';
import {
  getCameraDetailsText,
  getDeviceDetailsText,
  getPhotoDetailsText,
} from './helpers.ts';
import {CoreBlobImage} from '../../sharedComponents/Images/CoreBlobImage.tsx';
import {ImageErrorPlaceholder} from '../../sharedComponents/Images/ImageErrorPlaceholder.tsx';
import {useActiveProject} from '../../contexts/ActiveProjectContext.tsx';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {BodyText} from '../../sharedComponents/Text/BodyText.tsx';
import {sharedStyles} from './sharedStyles.ts';
import {useGetCreatedBy} from '../../hooks/server/useGetCreatedBy.ts';
import {useSingleDocByDocId} from '@comapeo/core-react';
import {useAppLanguageTag} from '../../hooks/useAppLanguageTag.ts';

const m = defineMessages({
  navTitle: {
    id: 'screens.PhotoPreviewModal.navTitle',
    defaultMessage: 'Photo Info',
  },
});

export function AttachedPhotoPreviewModal({
  route,
}: NativeRootNavigationProps<'AttachedPhotoPreviewModal'>) {
  const {photo, observationDocId} = route.params;
  const {formatMessage} = useIntl();
  const {projectId} = useActiveProject();

  const lang = useAppLanguageTag();

  const {data: observation} = useSingleDocByDocId({
    projectId,
    docType: 'observation',
    docId: observationDocId,
    lang,
  });

  const [imageLoadInfo, setImageLoadInfo] = useState<
    {height: number; width: number; storageSize?: number} | undefined
  >(undefined);

  const {data: memberInfo} = useGetCreatedBy(observation.originalVersionId);

  const photoInfo = getAttachmentPhotoInfo(photo);

  const deviceDetailsText = getDeviceDetailsText({
    make: photoInfo.make,
    model: photoInfo.model,
  });

  const cameraDetailsText = getCameraDetailsText(
    {fNumber: photoInfo.fNumber, layout: photoInfo.layout},
    formatMessage,
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
        formatMessage,
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
      </View>
      <View style={{gap: 20}}>
        {photoInfo.createdAt !== undefined && (
          <CreatedAtInfoItem createdAt={photoInfo.createdAt} />
        )}

        {photoInfo.coordinates && (
          <CoordinateInfoItem coordinates={photoInfo.coordinates} />
        )}

        {(deviceDetailsText || cameraDetailsText || photoDetailsText) && (
          <DeviceCameraPhotoInfoItem
            deviceDetailsText={deviceDetailsText}
            cameraDetailsText={cameraDetailsText}
            photoDetailsText={photoDetailsText}
          />
        )}

        <InfoItem
          icon={
            <MaterialIcons
              name="numbers"
              size={20}
              color={NEW_DARK_GREY}
              allowFontScaling
            />
          }>
          <BodyText selectable style={sharedStyles.primaryInfoText}>
            {observationDocId.slice(0, 15)}
          </BodyText>
        </InfoItem>

        <InfoItem
          icon={
            <MaterialIcons
              name="devices"
              size={20}
              color={NEW_DARK_GREY}
              allowFontScaling
            />
          }>
          <BodyText
            selectable
            style={sharedStyles.primaryInfoText}
            numberOfLines={1}>
            {memberInfo.deviceId.slice(0, 15)}
          </BodyText>
        </InfoItem>
      </View>
    </ScrollView>
  );
}

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return (): NativeStackNavigationOptions => {
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
    };
  };
}
