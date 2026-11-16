import type {ReactNode} from 'react';
import {View} from 'react-native';
import Octicons from '@react-native-vector-icons/octicons';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import {NEW_DARK_GREY} from '../../lib/styles';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {useIntl} from 'react-intl';
import {formatCoords} from '../../lib/coordinateFormat.ts';
import {sharedStyles} from './sharedStyles';
import {useCoordinateFormat} from '../../contexts/CoordinateFormatStoreContext';

export function InfoItem({
  children,
  icon,
}: {
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <View style={{flex: 1, flexDirection: 'row', gap: 12}}>
      <View>{icon}</View>
      <View style={{flex: 1}}>{children}</View>
    </View>
  );
}

export function CreatedAtInfoItem({createdAt}: {createdAt: number}) {
  const {formatDate, formatTime} = useIntl();
  return (
    <InfoItem
      icon={
        <Octicons
          name="calendar"
          size={20}
          color={NEW_DARK_GREY}
          allowFontScaling
        />
      }>
      <BodyText selectable style={sharedStyles.primaryInfoText}>
        {formatDate(createdAt, {
          dateStyle: 'full',
        })}
      </BodyText>

      <BodyText selectable style={sharedStyles.secondaryInfoText}>
        {formatTime(createdAt, {
          timeZoneName: 'short',
        })}
      </BodyText>
    </InfoItem>
  );
}

export function CoordinateInfoItem({
  coordinates,
}: {
  coordinates: {longitude: number; latitude: number};
}) {
  const coordinateFormat = useCoordinateFormat();

  return (
    <InfoItem
      icon={
        <Octicons
          name="location"
          size={20}
          color={NEW_DARK_GREY}
          allowFontScaling
        />
      }>
      <BodyText selectable style={sharedStyles.primaryInfoText}>
        {formatCoords({
          lon: coordinates.longitude,
          lat: coordinates.latitude,
          format: coordinateFormat,
        })}
      </BodyText>
    </InfoItem>
  );
}

type DeviceCameraPhotoInfoItemProps = {
  deviceDetailsText: string | null;
  cameraDetailsText: string | null;
  photoDetailsText: string | null;
};

export const DeviceCameraPhotoInfoItem = ({
  deviceDetailsText,
  photoDetailsText,
  cameraDetailsText,
}: DeviceCameraPhotoInfoItemProps) => {
  return (
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
        <BodyText selectable style={sharedStyles.primaryInfoText}>
          {deviceDetailsText}
        </BodyText>
      )}

      {cameraDetailsText && (
        <BodyText selectable style={sharedStyles.secondaryInfoText}>
          {cameraDetailsText}
        </BodyText>
      )}

      {photoDetailsText && (
        <BodyText selectable style={sharedStyles.secondaryInfoText}>
          {photoDetailsText}
        </BodyText>
      )}
    </InfoItem>
  );
};
