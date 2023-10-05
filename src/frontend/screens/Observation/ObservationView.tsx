import * as React from 'react';

import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Share,
  Image,
  Dimensions,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {defineMessages, useIntl} from 'react-intl';

import {ThumbnailScrollView} from '../../sharedComponents/ThumbnailScrollView';
import {CategoryCircleIcon} from '../../sharedComponents/icons/CategoryIcon';

import {
  BLACK,
  RED,
  WHITE,
  DARK_GREY,
  LIGHT_GREY,
  MEDIUM_GREY,
} from '../../lib/styles';
import {TouchableOpacity} from '../../sharedComponents/Touchables';

import {Loading} from '../../sharedComponents/Loading';
import {
  FormattedCoords,
  FormattedFieldValue,
  FormattedPresetName,
  FormattedFieldProp,
  FormattedObservationDate,
} from '../../sharedComponents/FormattedData';
import {filterPhotosFromAttachments} from '../../hooks/persistedState/usePersistedDraftObservation/photosMethods';
import {Field, Observation, Preset} from '@mapeo/schema';
import {MAP_STYLE} from '../MapScreen/MapViewMemoized';
import {convertToUTM} from '../../lib/utils';
import {PresetHeader} from './PresetHeader';
import {FieldDetails} from './FieldDetails';
import {useFieldsQuery} from '../../hooks/server/useFieldsQuery';
import {usePresetsQuery} from '../../hooks/server/usePresetsQuery';
import {useObservation} from '../../hooks/useObservation';

const m = defineMessages({
  share: {
    id: 'screens.Observation.ObservationView.share',
    defaultMessage: 'Share',
    description: 'Button to share an observation',
  },
  delete: {
    id: 'screens.Observation.ObservationView.delete',
    defaultMessage: 'Delete',
    description: 'Button to delete an observation',
  },
  notFound: {
    id: 'screens.Observation.notFound',
    defaultMessage: 'Observation not found',
    description: 'Message shown when an observation is not found',
  },
  deleteTitle: {
    id: 'screens.Observation.deleteTitle',
    defaultMessage: 'Delete observation?',
    description: 'Title of dialog asking confirmation to delete an observation',
  },
  cancel: {
    id: 'screens.Observation.cancel',
    defaultMessage: 'Cancel',
    description: 'Button to cancel delete of observation',
  },
  confirm: {
    id: 'screens.Observation.confirm',
    defaultMessage: 'Yes, delete',
    description: 'Button to confirm delete of observation',
  },
  title: {
    id: 'screens.Observation.title',
    defaultMessage: 'Observation',
    description:
      'Title of observation screen showing (non-editable) view of observation with map and answered questions',
  },
});

type ButtonProps = {
  onPress: () => any;
  color: string;
  iconName: 'delete' | 'share';
  title: string;
};

type MapProps = {
  lon: number;
  lat: number;
};

const InsetMapView = React.memo<MapProps>(({lon, lat}: MapProps) => {
  return (
    <MapboxGL.MapView
      style={styles.map}
      zoomEnabled={false}
      logoEnabled={false}
      scrollEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
      compassEnabled={false}
      styleURL={MAP_STYLE}>
      <MapboxGL.Camera
        centerCoordinate={[lon, lat]}
        zoomLevel={12}
        animationMode="moveTo"
      />
    </MapboxGL.MapView>
  );
});

const Button = ({onPress, color, iconName, title}: ButtonProps) => (
  <TouchableOpacity onPress={onPress} style={{flex: 1}}>
    <View style={styles.button}>
      <MaterialIcons
        size={30}
        name={iconName}
        color={DARK_GREY}
        style={styles.buttonIcon}
      />
      <Text style={styles.buttonText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

type ObservationViewProps = {
  observation: Observation;
};

export const ObservationView = ({id}: {id: string}) => {
  const {formatMessage: t} = useIntl();
  const {observation, preset} = useObservation(id);
  const fieldsQuery = useFieldsQuery();

  const defaultAcc: Field[] = [];
  const fields = !fieldsQuery.data
    ? undefined
    : preset.fieldIds.reduce((acc, pres) => {
        const fieldToAdd = fieldsQuery.data.find(
          field => field.tagKey === pres,
        );
        if (!fieldToAdd) return acc;
        return [...acc, fieldToAdd];
      }, defaultAcc);

  const deviceId = '';
  const {lat, lon, createdBy, attachments} = observation;
  const isMine = deviceId === createdBy;
  // Currently only show photo attachments
  const photos = [];

  // function handlePressPhoto(photoIndex: number) {
  //   navigation.navigate('PhotosModal', {
  //     photoIndex: photoIndex,
  //     observationId: observationId,
  //     editing: false,
  //   });
  // }

  // function handlePressDelete() {
  //   Alert.alert(t(m.deleteTitle), undefined, [
  //     {
  //       text: t(m.cancel),
  //       onPress: () => {},
  //     },
  //     {
  //       text: t(m.confirm),
  //       onPress: () => {
  //         //deleteObservation();
  //         //navigation.pop();
  //         return;
  //       },
  //     },
  //   ]);
  // }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}>
      <>
        {/* check lat and lon are not null or undefined */}
        {lat != null && lon != null && (
          <View>
            <Image
              style={styles.mapIcon}
              source={require('../../images/observation-icon.png')}
            />
            <View style={styles.coords}>
              <View style={styles.coordsPointer} />
              <Text style={styles.positionText}>
                {convertToUTM({lat, lon})}
              </Text>
            </View>
            <InsetMapView lat={lat} lon={lon} />
          </View>
        )}
        <View>
          <Text style={styles.time}>
            <FormattedObservationDate
              createdDate={observation.createdAt}
              variant="long"
            />
          </Text>
        </View>
        <View style={[styles.section, {flex: 1}]}>
          {preset && <PresetHeader preset={preset} />}
          {typeof observation.tags.notes === 'string' ? (
            <View style={{paddingTop: 15}}>
              <Text style={styles.textNotes}>{observation.tags.notes}</Text>
            </View>
          ) : null}
          {/* {!!photos.length && (
            <ThumbnailScrollView
              photos={
                photos
              }
              onPressPhoto={() => {}}
            />
          )} */}
        </View>
        {fields && fields.length > 0 && <FieldDetails fields={fields} />}
        <View style={styles.divider}></View>
        <View style={styles.buttonContainer}>
          {isMine && (
            <Button
              iconName="delete"
              title={t(m.delete)}
              color={RED}
              onPress={() => {}}
            />
          )}
        </View>
      </>
    </ScrollView>
  );
};

ObservationView.navTitle = m.title;

const MAP_HEIGHT = 175;
const ICON_OFFSET = {x: 22, y: 21};

const styles = StyleSheet.create({
  root: {
    backgroundColor: WHITE,
    flex: 1,
    flexDirection: 'column',
  },
  scrollContent: {minHeight: '100%'},
  map: {
    height: MAP_HEIGHT,
  },
  mapIcon: {
    position: 'absolute',
    zIndex: 11,
    width: 44,
    height: 75,
    left: Dimensions.get('screen').width / 2 - ICON_OFFSET.x,
    bottom: MAP_HEIGHT / 2 - ICON_OFFSET.y,
  },
  coords: {
    zIndex: 10,
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: 15,
    bottom: 15,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 0,
    paddingBottom: 10,
    backgroundColor: WHITE,
  },
  coordsPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: WHITE,
    top: -10,
  },
  divider: {
    backgroundColor: LIGHT_GREY,
    paddingVertical: 15,
  },
  positionText: {
    fontSize: 12,
    color: BLACK,
    fontWeight: '700',
  },
  section: {
    flex: 1,
    marginHorizontal: 15,
    paddingVertical: 15,
  },
  optionalSection: {
    borderTopColor: LIGHT_GREY,
    borderTopWidth: 1,
  },
  textNotes: {
    fontSize: 22,
    color: DARK_GREY,
    fontWeight: '100',
    marginLeft: 10,
  },
  time: {
    color: BLACK,
    backgroundColor: LIGHT_GREY,
    fontSize: 14,
    paddingVertical: 10,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
  },
  buttonIcon: {},
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  buttonContainer: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
