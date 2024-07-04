import * as React from 'react';

import {Text, View, ScrollView, StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {BLACK, WHITE, DARK_GREY, LIGHT_GREY} from '../../lib/styles';

import {FormattedObservationDate} from '../../sharedComponents/FormattedData';
import {Field} from '@mapeo/schema';
import {PresetHeader} from './PresetHeader';
import {useObservationWithPreset} from '../../hooks/useObservationWithPreset';
import {useFieldsQuery} from '../../hooks/server/fields';
import {FieldDetails} from './FieldDetails';
import {InsetMapView} from './InsetMapView';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {ObservationHeaderRight} from './ObservationHeaderRight';
import {MediaScrollView} from '../../sharedComponents/Thumbnail/MediaScrollView';
import {useAttachmentUrlQueries} from '../../hooks/server/media.ts';
import {ActionButtons} from '../../sharedComponents/ActionButtons.tsx';
import {usePersistedSettings} from '../../hooks/persistedState/usePersistedSettings.ts';
import {convertUrlToBase64} from '../../utils/base64.ts';
import Share from 'react-native-share';
import {formatCoords} from '../../lib/utils.ts';
import {useDeleteObservation} from '../../hooks/server/observations.ts';

const m = defineMessages({
  title: {
    id: 'screens.Observation.title',
    defaultMessage: 'Observation',
    description:
      'Title of observation screen showing (non-editable) view of observation with map and answered questions',
  },
  deleteTitle: {
    id: 'screens.Observation.deleteTitle',
    defaultMessage: 'Delete observation?',
    description: 'Title of dialog asking confirmation to delete an observation',
  },
  shareTextTitle: {
    id: 'screens.Observation.shareTextTitle',
    defaultMessage: 'Sharing text',
    description: 'Title of dialog to share an observation without media',
  },
  shareMediaTitle: {
    id: 'screens.Observation.shareMediaTitle',
    defaultMessage: 'Sharing image',
    description: 'Title of dialog to share an observation with media',
  },
  shareMessage: {
    id: 'screens.Observation.shareMessage',
    defaultMessage:
      'Mapeo Alert — _*{category_name}*_\n' +
      '{date, date, full} {time, time, long}\n' +
      '{coordinates}',
    description: 'Message that will be shared along with image',
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
  const [isShareButtonLoading, setShareButtonLoading] = React.useState(false);
  const format = usePersistedSettings(store => store.coordinateFormat);
  const {formatMessage: t} = useIntl();
  const deleteObservationMutation = useDeleteObservation();

  const defaultAcc: Field[] = [];
  const fields = fieldData
    ? preset.fieldIds.reduce((acc, pres) => {
        const fieldToAdd = fieldData.find(field => field.docId === pres);
        if (!fieldToAdd) return acc;
        return [...acc, fieldToAdd];
      }, defaultAcc)
    : [];

  const deviceId = '';
  const {lat, lon, createdBy} = observation;
  const isMine = deviceId === createdBy;

  // Currently only show photo attachments
  const photoAttachments = observation.attachments.filter(
    attachment => attachment.type === 'photo',
  );

  // thumbnail photos that are loaded and shown right away
  const attachmentUrls = useAttachmentUrlQueries(
    photoAttachments,
    'thumbnail',
  ).map(query => query.data);

  // full size photos that are not fetched automatically
  const attachmentUrlQueries = useAttachmentUrlQueries(
    photoAttachments,
    'original',
    false,
  );

  function handleDelete() {
    deleteObservationMutation.mutate(
      {id: observationId},
      {
        onSuccess: () => {
          navigation.pop();
        },
      },
    );
  }

  async function handlePressShare() {
    setShareButtonLoading(true);

    const urlsQueries = await Promise.all(
      attachmentUrlQueries.map(q => q.refetch()),
    );
    const urls = urlsQueries.map(query => query.data!.url);
    const base64Urls = await Promise.all(
      urls.map(url => convertUrlToBase64(url)),
    );

    Share.open({
      title: base64Urls.length > 0 ? t(m.shareMediaTitle) : t(m.shareTextTitle),
      urls: base64Urls,
      message: t(m.shareMessage, {
        category_name: preset.name,
        date: Date.now(),
        time: Date.now(),
        coordinates: lon && lat ? formatCoords({lon, lat, format}) : '',
      }),
    })
      .catch(() => {})
      .finally(() => setShareButtonLoading(false));
  }

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
          {attachmentUrls.length > 0 && (
            <MediaScrollView
              photos={attachmentUrls.map(attachmentData => {
                return !attachmentData
                  ? undefined
                  : {
                      thumbnailUri: attachmentData.url,
                      id: attachmentData.driveDiscoveryId,
                    };
              })}
              observationId={observationId}
              audioRecordings={[]}
            />
          )}
        </View>
        {fields.length > 0 && (
          <FieldDetails observation={observation} fields={fields} />
        )}
        <View style={styles.divider} />
        <ActionButtons
          handlePressShare={handlePressShare}
          handleDelete={handleDelete}
          isMine={isMine}
          isShareButtonLoading={isShareButtonLoading}
          deleteMessage={m.deleteTitle}
        />
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
