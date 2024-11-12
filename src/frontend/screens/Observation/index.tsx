import * as React from 'react';

import {Text, View, ScrollView, StyleSheet} from 'react-native';
import {defineMessages} from 'react-intl';
import {BLACK, WHITE, DARK_GREY, LIGHT_GREY, BLUE_GREY} from '../../lib/styles';
import {UIActivityIndicator} from 'react-native-indicators';

import {FormattedObservationDate} from '../../sharedComponents/FormattedData';
import {Field, Track} from '@comapeo/schema';
import {PresetHeader} from './PresetHeader';
import {useObservationWithPreset} from '../../hooks/useObservationWithPreset';
import {useFieldsQuery} from '../../hooks/server/fields';
import {FieldDetails} from './FieldDetails';
import {InsetMapView} from './InsetMapView';

import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {ObservationHeaderRight} from './ObservationHeaderRight';
import {MediaScrollView} from '../../sharedComponents/MediaScrollView/index.tsx';
import {useDeviceInfo} from '../../hooks/server/deviceInfo';
import {useOriginalVersionIdToDeviceId} from '../../hooks/server/projects.ts';
import {SavedPhoto} from '../../contexts/PhotoPromiseContext/types.ts';
import {ButtonFields} from './Buttons.tsx';
import {AudioAttachment} from '../../sharedTypes/audio.ts';
import {isSavedPhoto, isAudioAttachment} from '../../lib/attachmentTypeChecks';
import {TrackList} from './TrackList.tsx';
import {useTracks} from '../../hooks/server/track.ts';
import {Loading} from '../../sharedComponents/Loading.tsx';
import {Divider} from '../../sharedComponents/Divider.tsx';

const m = defineMessages({
  deleteTitle: {
    id: 'screens.Observation.deleteTitle',
    defaultMessage: 'Delete observation?',
    description: 'Title of dialog asking confirmation to delete an observation',
  },
  title: {
    id: 'screens.Observation.title',
    defaultMessage: 'Observation',
    description:
      'Title of observation screen showing (non-editable) view of observation with map and answered questions',
  },
});

export const ObservationScreen: NativeNavigationComponent<'Observation'> = ({
  route,
  navigation,
}) => {
  const {observationId} = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ObservationHeaderRight observationId={observationId} />
      ),
    });
  }, [navigation, observationId]);

  const {observation, preset} = useObservationWithPreset(observationId);
  const {data: fieldData} = useFieldsQuery();
  const [track, setTrack] = React.useState<undefined | 'loading' | Track>(
    'loading',
  );
  const tracksQuery = useTracks();

  React.useEffect(() => {
    if (track !== 'loading') return;
    if (tracksQuery.data) {
      const associatedTrack = tracksQuery.data.find(trackData =>
        trackData.observationRefs.some(ref => ref.docId === observationId),
      );
      setTrack(associatedTrack);
    }
  }, [track, tracksQuery.data, observationId]);

  const defaultAcc: Field[] = [];
  const fields =
    preset && fieldData
      ? preset.fieldRefs.reduce((acc, pres) => {
          const fieldToAdd = fieldData.find(
            field => field.docId === pres.docId,
          );
          if (!fieldToAdd) return acc;
          return [...acc, fieldToAdd];
        }, defaultAcc)
      : [];

  const {lat, lon, originalVersionId} = observation;
  const {data: deviceInfo, isPending: isDeviceInfoPending} = useDeviceInfo();
  const {data: convertedDeviceId, isPending: isDeviceIdPending} =
    useOriginalVersionIdToDeviceId(originalVersionId);

  const isMine =
    deviceInfo?.deviceId !== undefined &&
    convertedDeviceId !== undefined &&
    deviceInfo.deviceId === convertedDeviceId;

  const attachments = observation.attachments.filter(
    (attachment): attachment is SavedPhoto | AudioAttachment =>
      isSavedPhoto(attachment) || isAudioAttachment(attachment),
  );

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}>
      <>
        {/* check lat and lon are not null or undefined */}
        {lat != null && lon != null && <InsetMapView lat={lat} lon={lon} />}
        <View>
          <Text style={styles.time}>
            <FormattedObservationDate
              createdDate={observation.createdAt}
              variant="long"
            />
          </Text>
        </View>
        {track === 'loading' ? (
          <Loading />
        ) : (
          <>
            <View style={[styles.section, {flex: 1}]}>
              <PresetHeader preset={preset} style={{paddingHorizontal: 20}} />
              {track && (
                <View style={{marginTop: 20}}>
                  <Divider />
                  <TrackList track={track} />
                  <Divider />
                </View>
              )}
              {typeof observation.tags.notes === 'string' ? (
                <View style={{paddingTop: 15}}>
                  <Text style={styles.textNotes}>{observation.tags.notes}</Text>
                </View>
              ) : null}
              {attachments.length > 0 && (
                <MediaScrollView
                  attachments={attachments}
                  observationId={observationId}
                />
              )}
            </View>
            {fields.length > 0 && (
              <FieldDetails observation={observation} fields={fields} />
            )}
            <View style={styles.divider} />
            {isDeviceInfoPending || isDeviceIdPending ? (
              <UIActivityIndicator size={20} />
            ) : (
              <ButtonFields
                isMine={isMine}
                observationId={observationId}
                fields={fields}
              />
            )}
          </>
        )}
      </>
    </ScrollView>
  );
};

ObservationScreen.navTitle = m.title;

const styles = StyleSheet.create({
  root: {
    backgroundColor: WHITE,
    flex: 1,
    flexDirection: 'column',
  },
  scrollContent: {minHeight: '100%'},
  divider: {
    backgroundColor: BLUE_GREY,
    paddingVertical: 15,
  },
  section: {
    flex: 1,
    paddingVertical: 15,
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
});
