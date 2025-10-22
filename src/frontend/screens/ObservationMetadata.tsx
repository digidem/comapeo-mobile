import * as React from 'react';
import BadgeWithCheck from '../images/VerifiedBadgeWithCheck.svg';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {
  defineMessages,
  FormattedDate,
  FormattedTime,
  useIntl,
} from 'react-intl';
import {StyleSheet} from 'react-native';
import {VERY_LIGHT_GREY, NEW_DARK_GREY, WHITE, BLUE_GREY} from '../lib/styles';
import {NativeNavigationComponent} from '../sharedTypes/navigation';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {FormattedCoords} from '../sharedComponents/FormattedData';
import Octicons from '@react-native-vector-icons/octicons';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import UnverifiedBadge from '../images/UnverifiedBadge.svg';
import {useProjectSettings} from '@comapeo/core-react';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {useCoordinateFormat} from '../contexts/CoordinateFormatStoreContext';
import {useOpenShareDialog} from '../hooks/share';
import {useObservationWithPreset} from '../hooks/useObservationWithPreset';
import {formatCoords} from '../lib/coordinateFormat';

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
  sentFrom: {
    id: 'screens.ObservationMetadataVerified.sentFrom',
    defaultMessage: 'CoMapeo Metadata sent from',
  },
  fallbackPresetName: {
    id: 'screens.Observation.fallbackPresetName',
    defaultMessage: 'Observation',
    description:
      'Fallback name used when category name cannot be determined for observation',
  },
  coMapeoMetadata: {
    id: 'screens.ObservationMetadataVerified.coMapeoMetadata',
    defaultMessage: 'CoMapeo Metadata',
  },
  date: {
    id: 'screens.ObservationMetadataVerified.date',
    defaultMessage: 'Date',
  },
  validatedByCoMapeo: {
    id: 'screens.ObservationMetadataVerified.validatedByCoMapeo',
    defaultMessage: 'Sent and Validated by CoMapeo',
  },
  sentByComapeo: {
    id: 'screens.ObservationMetadataVerified.sentByComapeo',
    defaultMessage: 'Sent by CoMapeo',
  },
  locationManuallyEntered: {
    id: 'screens.ObservationMetadataVerified.locationManuallyEntered',
    defaultMessage: 'Location was manually entered',
  },
  location: {
    id: 'screens.ObservationMetadataVerified.location',
    defaultMessage: 'Location',
  },
});

const ICON_SIZE = 25;

export const ObservationMetadata: NativeNavigationComponent<
  'ObservationMetadata'
> = ({route}) => {
  const {formatMessage, formatDate, formatTime} = useIntl();
  const {projectId} = useActiveProject();
  const {
    observation: {createdAt, lat, lon, metadata},
    preset,
  } = useObservationWithPreset(route.params.observationId);

  const {
    data: {name},
  } = useProjectSettings({projectId});
  const coordinateFormat = useCoordinateFormat();
  const openShare = useOpenShareDialog();
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
        value: lat != null ? Number(lat).toFixed(5) : undefined,
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
        value: lon != null ? Number(lon).toFixed(5) : undefined,
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
        value:
          metadata?.position?.coords.accuracy != null
            ? `± ${Number(metadata.position.coords.accuracy).toFixed(0)}`
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
        value:
          metadata?.position?.coords.altitude != null
            ? Number(metadata.position.coords.altitude).toFixed(0)
            : undefined,
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
        value:
          metadata?.position?.coords.altitudeAccuracy != null
            ? `± ${Number(metadata.position.coords.altitudeAccuracy).toFixed(0)}`
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
        value:
          metadata?.position?.coords.speed != null
            ? Number(metadata.position.coords.speed).toFixed(2)
            : undefined,
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

  function roundUtmInLocationLine(
    locationLine: string,
    coordinateFormat: unknown,
  ): string {
    return String(coordinateFormat) === 'utm'
      ? locationLine.replace(/-?\d+\.\d+/g, m => String(Math.round(Number(m))))
      : locationLine;
  }

  async function handlePressShare() {
    const metadataAsFormattedString = filteredListData
      .map(item => {
        const key = Object.keys(item)[0] as string;
        const data = item[key]!;
        return `${data.label}: ${data.value} ${data.unit}`;
      })
      .join('\n');

    const footer = !manualLocation
      ? `-${formatMessage(m.validatedByCoMapeo)}-`
      : `-${formatMessage(m.locationManuallyEntered)}-\n-${formatMessage(m.sentByComapeo)}-`;

    const projectName = !name
      ? formatMessage(m.coMapeoMetadata)
      : formatMessage(m.sentFrom) + ' ' + name;

    const categoryName = preset
      ? preset.name
      : formatMessage(m.fallbackPresetName);

    const date = `${formatMessage(m.date)}: ${formatDate(createdAt, {dateStyle: 'full'})}`;

    const time = formatTime(createdAt, {timeStyle: 'medium'});

    const baseLocation =
      lat === undefined || lon === undefined
        ? ''
        : `${formatMessage(m.location)}: ${formatCoords({lat, lon, format: coordinateFormat})}`;

    const formattedLocation = baseLocation
      ? roundUtmInLocationLine(baseLocation, coordinateFormat)
      : '';

    await openShare.mutateAsync({
      subject: `${projectName}, ${categoryName}, ${formatDate(createdAt, {dateStyle: 'long'})}`,
      message: `${projectName} - ${categoryName}\n${date}\n${time}\n${formattedLocation}\n${metadataAsFormattedString}\n\n${footer}`,
      failOnCancel: false,
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{alignItems: 'center', marginBottom: 20}}>
          {manualLocation ? <ManuallyEnteredHeader /> : <VerifiedHeader />}
        </View>
        <View style={{paddingHorizontal: 20}}>
          <View style={{marginBottom: 10, flexDirection: 'row'}}>
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

        {filteredListData.length > 0 &&
          filteredListData.map((item, index) => {
            const key = Object.keys(item)[0] as string;
            return (
              <View
                key={key}
                style={[
                  styles.listItem,
                  {
                    backgroundColor: index % 2 === 0 ? VERY_LIGHT_GREY : WHITE,
                  },
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
          })}
      </ScrollView>
      <TouchableOpacity
        onPress={handlePressShare}
        style={styles.shareContainer}>
        <MaterialIcons name="share" size={25} />
        <BodyText>Share</BodyText>
      </TouchableOpacity>
    </View>
  );
};

export const VerifiedHeader = () => {
  // const {formatMessage} = useIntl();

  return (
    <>
      <BadgeWithCheck />
      {/* Removing until "How we validate" page is created
      <View style={[styles.flexRow, {marginVertical: 10}]}>
        <VerifiedBadgeBlue stroke={COMAPEO_BLUE} style={{marginRight: 10}} />
        <HeaderText variant="header6" style={{color: COMAPEO_BLUE}}>
          {formatMessage(m.howWeCheck)}
        </HeaderText>
      </View> */}
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
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingBottom: 20,
    paddingTop: 40,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  shareContainer: {
    alignItems: 'center',
    borderTopColor: VERY_LIGHT_GREY,
    borderTopWidth: 1,
    paddingBottom: 20,
    paddingTop: 20,
  },
});

ObservationMetadata.navTitle = m.navTitle;
