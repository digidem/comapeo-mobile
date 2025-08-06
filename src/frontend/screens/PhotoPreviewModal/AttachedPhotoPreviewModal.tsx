import {captureException, ErrorBoundary} from '@sentry/react-native';
import type {ImageLoadEventData} from 'expo-image';
import React, {useState} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView, View} from 'react-native';
import {getExpoImageStorageSize} from '../../lib/file-system.ts';
import {getAttachmentPhotoInfo} from '../../lib/photos.ts';
import {DARK_GREY, NEW_DARK_GREY} from '../../lib/styles.ts';

import type {NativeRootNavigationProps} from '../../sharedTypes/navigation.ts';
import {
  CoordinateInfoItem,
  CreatedAtInfoItem,
  DeviceCameraPhotoInfoItem,
  InfoItem,
} from './InfoItem.tsx';
import {
  calcPhotoTimeRelativeToObs,
  calculateDistanceFromObservation,
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
import {Accordian} from '../../sharedComponents/Accordian.tsx';
import Octicons from 'react-native-vector-icons/Octicons';

const m = defineMessages({
  validatedByCoMapeo: {
    id: 'screens.PhotoPreviewModal.validatedByCoMapeo',
    defaultMessage: 'Validated by CoMapeo',
  },
  verifiedOriginal: {
    id: 'screens.PhotoPreviewModal.verifiedOriginal',
    defaultMessage: 'This is a verified unaltered original',
    description: 'Text indicating that the photo is a verified original',
  },
  timeAttached: {
    id: 'screens.PhotoPreviewModal.timeAttached',
    defaultMessage:
      'Attached {min} {min, plural, one {minute} other {minutes}} after observation',
    description:
      'Label for the time when the photo was attached to an observation',
  },
  distanceFromObservation: {
    id: 'screens.PhotoPreviewModal.distanceFromObservation',
    defaultMessage: 'Attached {distance} m from observation',
  },
  attachedAtTime: {
    id: 'screens.PhotoPreviewModal.attachedAtTime',
    defaultMessage: 'Attached at the time of the observation',
    description:
      'Label for the time when the photo was attached to an observation',
  },
  attachedBy: {
    id: 'screens.PhotoPreviewModal.attachedBy',
    defaultMessage: 'Attached by {name}',
    description:
      'Label for the person who attached the photo to the observation',
  },
});

export function AttachedPhotoPreviewModal({
  route,
}: NativeRootNavigationProps<'AttachedPhotoPreviewModal'>) {
  const {photo, observationDocId} = route.params;
  const photoInfo = getAttachmentPhotoInfo(photo);
  const {createdAt: photoCreatedAt, coordinates: photoCoordinates} = photoInfo;

  const {projectId} = useActiveProject();
  const lang = useAppLanguageTag();
  const {
    data: {
      originalVersionId: observationOriginalVersionId,
      createdAt: observationCreatedAt,
      lat,
      lon,
    },
  } = useSingleDocByDocId({
    projectId,
    docType: 'observation',
    docId: observationDocId,
    lang,
  });

  const {data: memberInfo} = useGetCreatedBy(observationOriginalVersionId);

  const {formatMessage} = useIntl();

  const photoTimeRelativeToObs = photoCreatedAt
    ? calcPhotoTimeRelativeToObs({
        photoCreatedAt: photoCreatedAt,
        observationCreatedAt: new Date(observationCreatedAt).getTime(),
      })
    : undefined;

  const distanceFromObservation =
    photoCoordinates && lon && lat
      ? calculateDistanceFromObservation({
          photoLocation: [
            photoCoordinates.longitude,
            photoCoordinates.latitude,
          ],
          observationLocation: [lon, lat],
        })
      : undefined;

  const [imageLoadInfo, setImageLoadInfo] = useState<
    {height: number; width: number; storageSize?: number} | undefined
  >(undefined);

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
        <View
          style={{
            borderColor: DARK_GREY,
            borderWidth: 1,
            borderRadius: 10,
          }}>
          <Accordian
            style={{padding: 20}}
            title={
              <View style={{flexDirection: 'row', gap: 12}}>
                <Octicons
                  name="check-circle"
                  size={20}
                  color={NEW_DARK_GREY}
                  allowFontScaling
                />
                <BodyText selectable style={sharedStyles.primaryInfoText}>
                  {formatMessage(m.validatedByCoMapeo)}
                </BodyText>
              </View>
            }
            innerAccordianDetails={
              <View
                style={{
                  gap: 20,
                  padding: 20,
                  borderTopColor: DARK_GREY,
                  borderTopWidth: 1,
                }}>
                <BodyText selectable style={sharedStyles.primaryInfoText}>
                  {formatMessage(m.verifiedOriginal)}
                </BodyText>

                {photoTimeRelativeToObs && (
                  <InfoItem
                    icon={
                      <MaterialIcons
                        name="timer"
                        size={20}
                        color={NEW_DARK_GREY}
                        allowFontScaling
                      />
                    }>
                    <BodyText selectable style={sharedStyles.primaryInfoText}>
                      {photoTimeRelativeToObs > 0
                        ? formatMessage(m.timeAttached, {
                            min: photoTimeRelativeToObs,
                          })
                        : formatMessage(m.attachedAtTime)}
                    </BodyText>
                  </InfoItem>
                )}

                {distanceFromObservation && (
                  <InfoItem
                    icon={
                      <Octicons
                        name="arrow-both"
                        size={20}
                        color={NEW_DARK_GREY}
                        allowFontScaling
                      />
                    }>
                    <BodyText selectable style={sharedStyles.primaryInfoText}>
                      {formatMessage(m.distanceFromObservation, {
                        distance: distanceFromObservation.toFixed(2),
                      })}
                    </BodyText>
                  </InfoItem>
                )}

                {memberInfo.name && (
                  <InfoItem
                    icon={
                      <MaterialIcons
                        name="devices"
                        size={20}
                        color={NEW_DARK_GREY}
                        allowFontScaling
                      />
                    }>
                    <BodyText selectable style={sharedStyles.primaryInfoText}>
                      {formatMessage(m.attachedBy, {name: memberInfo.name})}
                    </BodyText>
                  </InfoItem>
                )}
              </View>
            }
          />
        </View>
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
