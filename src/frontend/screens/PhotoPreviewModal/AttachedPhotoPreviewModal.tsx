import {ErrorBoundary} from '@sentry/react-native';
import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView, View} from 'react-native';
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
  calculateDistanceAsMeters,
  getCameraDetailsText,
  getDeviceDetailsText,
  getPhotoDetailsText,
  getPhotoDimensions,
  useImageLoadInfo,
} from './helpers.ts';
import {CoreBlobImage} from '../../sharedComponents/Images/CoreBlobImage.tsx';
import {ImageErrorPlaceholder} from '../../sharedComponents/Images/ImageErrorPlaceholder.tsx';
import {useActiveProject} from '../../contexts/ActiveProjectContext.tsx';
import {
  useUnitSystem,
  type UnitSystem,
} from '../../contexts/UnitSystemStoreContext';
import {kmOrConversion, metersOrConversion} from '../../lib/unitConversion';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {BodyText} from '../../sharedComponents/Text/BodyText.tsx';
import {sharedStyles} from './sharedStyles.ts';
import {useSingleDocByDocId, useSingleMember} from '@comapeo/core-react';
import {useLocaleState} from '../../contexts/LocaleStoreContext.tsx';
import {Accordian} from '../../sharedComponents/Accordian.tsx';
import Octicons from '@react-native-vector-icons/octicons';

function formatDistance(meters: number, unitSystem: UnitSystem): string {
  if (unitSystem === 'imperial') {
    if (meters < 1000) {
      const {value, unit} = metersOrConversion(meters, unitSystem);
      return `${value.toFixed(2)} ${unit}`;
    }
    const {value, unit} = kmOrConversion(meters / 1000, unitSystem);
    return `${value.toFixed(2)} ${unit}`;
  }
  if (meters < 1000) {
    return `${meters.toFixed(2)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

const m = defineMessages({
  validatedByCoMapeo: {
    id: 'screens.PhotoPreviewModal.validatedByCoMapeo',
    defaultMessage: 'Validated by CoMapeo',
  },
  verifiedOriginal: {
    id: 'screens.PhotoPreviewModal.verifiedOriginal',
    defaultMessage: 'This is a verified unaltered original.',
    description: 'Text indicating that the photo is a verified original',
  },
  timeAttached: {
    id: 'screens.PhotoPreviewModal.timeAttached',
    defaultMessage: 'Attached {formattedNum} after observation',
    description:
      'Label for the time when the photo was attached to an observation',
  },
  distanceFromObs: {
    id: 'screens.PhotoPreviewModal.distanceFromObs',
    defaultMessage: 'Attached {distance} from observation',
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
  const lang = useLocaleState(s => s.languageTag);
  const {
    data: {createdBy, createdAt: observationCreatedAt, lat, lon},
  } = useSingleDocByDocId({
    projectId,
    docType: 'observation',
    docId: observationDocId,
    lang,
  });

  const {data: memberInfo} = useSingleMember({projectId, deviceId: createdBy});

  const {formatMessage, formatNumber} = useIntl();
  const unitSystem = useUnitSystem();

  const photoTimeRelativeToObs = photoCreatedAt
    ? calcPhotoTimeRelativeToObs({
        photoCreatedAt: photoCreatedAt,
        observationCreatedAt: new Date(observationCreatedAt).getTime(),
      })
    : undefined;

  const metersFromObservation =
    photoCoordinates && lon !== undefined && lat !== undefined
      ? calculateDistanceAsMeters({
          photoLocation: [
            photoCoordinates.longitude,
            photoCoordinates.latitude,
          ],
          observationLocation: [lon, lat],
        })
      : undefined;

  const {imageLoadInfo, onImageLoad} = useImageLoadInfo();

  const deviceDetailsText = getDeviceDetailsText({
    make: photoInfo.make,
    model: photoInfo.model,
  });

  const cameraDetailsText = getCameraDetailsText(
    {fNumber: photoInfo.fNumber, layout: photoInfo.layout},
    formatMessage,
  );

  const photoDimensions = getPhotoDimensions({
    photoInfoHeight: photoInfo.height,
    photoInfoWidth: photoInfo.width,
    imageLoadInfoHeight: imageLoadInfo?.height,
    imageLoadInfoWidth: imageLoadInfo?.width,
  });

  const photoDetailsText = photoDimensions
    ? getPhotoDetailsText(
        {...photoDimensions, storageSize: imageLoadInfo?.storageSize},
        formatMessage,
      )
    : null;

  const distance = metersFromObservation
    ? formatDistance(metersFromObservation, unitSystem)
    : null;

  return (
    <ScrollView contentContainerStyle={sharedStyles.container}>
      <View>
        <View style={sharedStyles.imageContainer}>
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
        {!photoInfo.external && (
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

                  {photoTimeRelativeToObs !== undefined && (
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
                        {photoTimeRelativeToObs.value > 0
                          ? formatMessage(m.timeAttached, {
                              formattedNum: formatNumber(
                                photoTimeRelativeToObs.value,
                                {
                                  style: 'unit',
                                  unit: photoTimeRelativeToObs.unit,
                                },
                              ),
                            })
                          : formatMessage(m.attachedAtTime)}
                      </BodyText>
                    </InfoItem>
                  )}

                  {metersFromObservation !== undefined && (
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
                        {formatMessage(m.distanceFromObs, {distance})}
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
        )}
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
