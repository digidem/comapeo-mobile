import * as React from 'react';
import BadgeWithCheck from '../../images/VerifiedBadgeWithCheck.svg';
import VerifiedBadge from '../../images/verifiedBadge.svg';
import {FlatList, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {StyleSheet} from 'react-native';
import {COMAPEO_BLUE, LIGHT_GREY, WHITE} from '../../lib/styles';
import {useObservation} from '../../hooks/server/observations';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {useCoordinateFormat} from '../../contexts/CoordinateFormatContext';
import {FormattedCoords} from '../../sharedComponents/FormattedData';

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
});

export const ObservationMetadataVerified: NativeNavigationComponent<
  'ObservationMetadataVerified'
> = ({route}) => {
  const {formatMessage} = useIntl();
  const {
    data: {createdAt, lat, lon, metadata},
  } = useObservation(route.params.observationId);
  const coordinateFormat = useCoordinateFormat();

  const listData: {
    [key: string]: {label: string; value: number | undefined; unit: string};
  }[] = [
    {
      latitude: {
        label: formatMessage(m.latitude),
        value: lat,
        unit: '°',
      },
    },
    {
      longitude: {
        label: formatMessage(m.longitude),
        value: lon,
        unit: '°',
      },
    },
    {
      accuracy: {
        label: formatMessage(m.accuracy),
        value: metadata?.position?.coords.accuracy,
        unit: 'm',
      },
    },
    {
      altitude: {
        label: formatMessage(m.altitude),
        value: metadata?.position?.coords.altitude,
        unit: 'm',
      },
    },
    {
      altitudeAccuracy: {
        label: formatMessage(m.altitudeAccuracy),
        value: metadata?.position?.coords.altitudeAccuracy,
        unit: 'm',
      },
    },
    {
      speed: {
        label: formatMessage(m.speed),
        value: metadata?.position?.coords.speed,
        unit: 'm/s',
      },
    },
  ];

  // takes out any undefined values
  const filteredListData = listData.filter(
    (
      item,
    ): item is Record<string, {label: string; value: number; unit: string}> => {
      const key = Object.keys(item)[0] as keyof typeof item;
      return item[key]?.value !== undefined;
    },
  );
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', padding: 20}}>
        <BadgeWithCheck />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <VerifiedBadge color={COMAPEO_BLUE} style={{marginRight: 10}} />
          <HeaderText variant="header6">
            {formatMessage(m.howWeCheck)}
          </HeaderText>
        </View>
      </View>
      <View style={{paddingHorizontal: 20}}>
        <BodyText variant="smallMeta">{createdAt}</BodyText>
        {lat !== undefined && lon !== undefined && (
          <BodyText variant="smallMeta">
            <FormattedCoords lat={lat} lon={lon} format={coordinateFormat} />
          </BodyText>
        )}
      </View>
      {filteredListData.length > 0 && (
        <FlatList
          data={filteredListData}
          renderItem={({item, index}) => {
            const key = Object.keys(item)[0] as string;
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: index % 2 === 0 ? LIGHT_GREY : WHITE,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                }}>
                <BodyText variant="smallMeta">{item[key]!.label}: </BodyText>
                <BodyText variant="smallMeta">
                  {item[key]!.value + ' ' + item[key]!.unit}
                </BodyText>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
});

ObservationMetadataVerified.navTitle = m.navTitle;
