import * as React from 'react';

import {Text, View, ScrollView, StyleSheet} from 'react-native';
import {defineMessages} from 'react-intl';
import {BLACK, WHITE, DARK_GREY, LIGHT_GREY} from '../../lib/styles';

import {FormattedObservationDate} from '../../sharedComponents/FormattedData';
import {Field} from '@mapeo/schema';
import {PresetHeader} from './PresetHeader';
import {useObservationWithPreset} from '../../hooks/useObservationWithPreset';
import {useFieldsQuery} from '../../hooks/server/fields';
import {FieldDetails} from './FieldDetails';
import {InsetMapView} from './InsetMapView';
import {ButtonFields} from './Buttons';
import {NativeNavigationComponent} from '../../sharedTypes';
import {ObservationHeaderRight} from './ObservationHeaderRight';

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
  const {lat, lon, createdBy} = observation;
  const isMine = deviceId === createdBy;
  // Currently only show photo attachments
  const photos = [];

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
        <ButtonFields isMine={isMine} observationId={observationId} />
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
    backgroundColor: LIGHT_GREY,
    paddingVertical: 15,
  },
  section: {
    flex: 1,
    marginHorizontal: 15,
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
