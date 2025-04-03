import * as React from 'react';
import BadgeWithCheck from '../images/VerifiedBadgeWithCheck.svg';
import VerifiedBadge from '../images/verifiedBadge.svg';
import {FlatList, View} from 'react-native';
import {
  defineMessages,
  FormattedDate,
  FormattedTime,
  useIntl,
} from 'react-intl';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {StyleSheet} from 'react-native';
import {
  COMAPEO_BLUE,
  VERY_LIGHT_GREY,
  NEW_DARK_GREY,
  WHITE,
  BLUE_GREY,
} from '../lib/styles';
import {useObservation} from '../hooks/server/observations';
import {NativeNavigationComponent} from '../sharedTypes/navigation';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {useCoordinateFormat} from '../contexts/CoordinateFormatContext';
import {FormattedCoords} from '../sharedComponents/FormattedData';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UnverifiedBadge from '../images/UnverifiedBadge.svg';

const m = defineMessages({
  navTitle: {
    id: 'screens.ObservationMetadataVerified.navTitle',
    defaultMessage: 'Observation Metadata',
  },
  howWeCheck: {
    id: 'screens.ObservationMetadataVerified.howWeCheck',
    defaultMessage: 'How we validate',
  },
  latitude: {
    id: 'screens.ObservationMetadataVerified.latitude',
    defaultMessage: 'Latitude',
  },
  longitude: {
    id: 'screens.ObservationMetadataVerified.longitude',
    defaultMessage: 'Longitude',
  },
  accuracy: {
    id: 'screens.ObservationMetadataVerified.accuracy',
    defaultMessage: 'Accuracy',
  },
  altitude: {
    id: 'screens.ObservationMetadataVerified.altitude',
    defaultMessage: 'Altitude',
  },
  altitudeAccuracy: {
    id: 'screens.ObservationMetadataVerified.altitudeAccuracy',
    defaultMessage: 'Altitude Accuracy',
  },
  speed: {
    id: 'screens.ObservationMetadataVerified.speed',
    defaultMessage: 'Speed',
  },
  dataEntered: {
    id: 'screens.ObservationMetadataVerified.dataEntered',
    defaultMessage: 'This data was manually entered.',
  },
  manuallyEntered: {
    id: 'screens.ObservationMetadataVerified.manuallyEntered',
    defaultMessage: 'Manually entered.',
  },
});

const ICON_SIZE = 25;

export const ObservationMetadata: NativeNavigationComponent<
  'ObservationMetadata'
> = ({route}) => {
  const {formatMessage} = useIntl();
  const {
    data: {createdAt, lat, lon, metadata},
  } = useObservation(route.params.observationId);
  const coordinateFormat = useCoordinateFormat();
  const manualLocation = metadata?.manualLocation;

  const listData: {
    [key: string]: {
      label: string;
      value: number | undefined | string;
      unit: string;
      icon: React.ReactNode;
    };
  }[] = [
    {
      latitude: {
        label: formatMessage(m.latitude),
        value: lat,
        unit: '°',
        icon: (
          <MaterialCommunityIcons
            name="latitude"
            color={NEW_DARK_GREY}
            size={ICON_SIZE}
          />
        ),
      },
    },
    {
      longitude: {
        label: formatMessage(m.longitude),
        value: lon,
        unit: '°',
        icon: (
          <MaterialCommunityIcons
            name="longitude"
            color={NEW_DARK_GREY}
            size={ICON_SIZE}
          />
        ),
      },
    },
    {
      accuracy: {
        label: formatMessage(m.accuracy),
        value: metadata?.position?.coords.accuracy
          ? '± ' + metadata.position.coords.accuracy
          : undefined,
        unit: 'm',
        icon: (
          <MaterialCommunityIcons
            name="bullseye-arrow"
            color={NEW_DARK_GREY}
            size={ICON_SIZE}
          />
        ),
      },
    },
    {
      altitude: {
        label: formatMessage(m.altitude),
        value: metadata?.position?.coords.altitude,
        unit: 'm',
        icon: (
          <MaterialCommunityIcons
            name="image-filter-hdr"
            color={NEW_DARK_GREY}
            size={ICON_SIZE}
          />
        ),
      },
    },
    {
      altitudeAccuracy: {
        label: formatMessage(m.altitudeAccuracy),
        value: metadata?.position?.coords.altitudeAccuracy
          ? '± ' + metadata.position.coords.altitudeAccuracy
          : undefined,
        unit: 'm',
        icon: (
          <MaterialCommunityIcons
            name="chevron-double-up"
            color={NEW_DARK_GREY}
            size={ICON_SIZE}
          />
        ),
      },
    },
    {
      speed: {
        label: formatMessage(m.speed),
        value: metadata?.position?.coords.speed,
        unit: 'm/s',
        icon: (
          <MaterialIcons name="speed" color={NEW_DARK_GREY} size={ICON_SIZE} />
        ),
      },
    },
  ];

  // takes out any undefined values
  const filteredListData = listData.filter(
    (
      item,
    ): item is Record<
      string,
      {
        label: string;
        value: number | string;
        unit: string;
        icon: React.ReactNode;
      }
    > => {
      const key = Object.keys(item)[0] as keyof typeof item;
      return item[key]?.value !== undefined;
    },
  );
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', marginBottom: 20}}>
        {manualLocation ? <ManuallyEnteredHeader /> : <VerifiedHeader />}
      </View>

      <View style={{paddingHorizontal: 20}}>
        <View
          style={{
            marginBottom: 10,
            flexDirection: 'row',
          }}>
          <Octicons
            name="calendar"
            color={NEW_DARK_GREY}
            size={ICON_SIZE}
            style={{marginRight: 10}}
          />
          <View>
            <BodyText variant="smallMeta">
              <FormattedDate value={createdAt} dateStyle="full" />
            </BodyText>
            <BodyText style={{color: NEW_DARK_GREY}} variant="smallMeta">
              <FormattedTime value={createdAt} timeStyle="short" />
            </BodyText>
          </View>
        </View>
        {lat !== undefined && lon !== undefined && (
          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <MaterialIcons
              name="place"
              color={NEW_DARK_GREY}
              size={ICON_SIZE}
              style={{marginRight: 10}}
            />
            <View>
              <BodyText variant="smallMeta">
                <FormattedCoords
                  lat={lat}
                  lon={lon}
                  format={coordinateFormat}
                />
              </BodyText>
              {manualLocation && (
                <BodyText style={{color: NEW_DARK_GREY}} variant="smallMeta">
                  {formatMessage(m.manuallyEntered)}
                </BodyText>
              )}
            </View>
          </View>
        )}
      </View>
      {filteredListData.length > 0 && (
        <FlatList
          data={filteredListData}
          renderItem={({item, index}) => {
            const key = Object.keys(item)[0] as string;
            return (
              <View
                style={[
                  styles.listItem,
                  {backgroundColor: index % 2 === 0 ? VERY_LIGHT_GREY : WHITE},
                ]}>
                <View style={styles.flexRow}>
                  {item[key]!.icon}
                  <BodyText
                    style={{
                      textAlign: 'left',
                      marginLeft: 5,
                      fontWeight: '700',
                    }}
                    variant="smallMeta">
                    {item[key]!.label}{' '}
                  </BodyText>
                </View>
                <View style={styles.valueText}>
                  <BodyText
                    variant="smallMeta"
                    style={{flex: 1, textAlign: 'right'}}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item[key]!.value + ' '}
                  </BodyText>
                  <BodyText variant="smallMeta">{item[key]!.unit}</BodyText>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export const VerifiedHeader = () => {
  const {formatMessage} = useIntl();

  return (
    <>
      <BadgeWithCheck />
      <View style={[styles.flexRow, {marginVertical: 10}]}>
        <VerifiedBadge stroke={COMAPEO_BLUE} style={{marginRight: 10}} />
        <HeaderText variant="header6" style={{color: COMAPEO_BLUE}}>
          {formatMessage(m.howWeCheck)}
        </HeaderText>
      </View>
    </>
  );
};

export const ManuallyEnteredHeader = () => {
  const {formatMessage} = useIntl();

  return (
    <View style={styles.manuallyEnteredHeader}>
      <UnverifiedBadge />
      <BodyText variant="smallMeta">{formatMessage(m.dataEntered)}</BodyText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  flexRow: {flexDirection: 'row', alignItems: 'center'},
  valueText: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 5,
  },
  manuallyEnteredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 6,
    padding: 15,
    backgroundColor: VERY_LIGHT_GREY,
    borderColor: BLUE_GREY,
    borderWidth: 1,
  },
});

ObservationMetadata.navTitle = m.navTitle;
