import * as React from 'react';

import {View, ScrollView, StyleSheet} from 'react-native';
import {defineMessages} from 'react-intl';
import {WHITE, DARK_GREY, LIGHT_GREY, BLUE_GREY} from '../../lib/styles';

import {FormattedObservationDate} from '../../sharedComponents/FormattedData';
import {PresetHeader} from './PresetHeader';
import {FieldDetails} from './FieldDetails';
import {InsetMapView} from './InsetMapView';
import {ObservationHeaderRight} from './ObservationHeaderRight';
import {MediaScrollView} from '../../sharedComponents/MediaScrollView/index.tsx';
import {
  useOwnDeviceInfo,
  useSingleDocByDocId,
  useManyDocs,
  useDocumentCreatedBy,
} from '@comapeo/core-react';
import {SavedPhoto} from '../../contexts/PhotoPromiseContext/types.ts';
import {ButtonFields} from './Buttons.tsx';
import {AudioAttachment} from '../../sharedTypes/audio.ts';
import {isSavedPhoto, isAudioAttachment} from '../../lib/attachmentTypeChecks';
import {TrackAccordian} from './TrackAccordian.tsx';
import {Divider} from '../../sharedComponents/Divider.tsx';
import {BodyText} from '../../sharedComponents/Text/BodyText.tsx';
import {HeaderText} from '../../sharedComponents/Text/HeaderText.tsx';
import {Loading} from '../../sharedComponents/Loading.tsx';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamsList} from '../../sharedTypes/navigation';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {Field} from '@comapeo/schema';

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

export const ObservationScreen = ({
  observationId,
  navigation,
}: {
  observationId: string;
  navigation: NativeStackScreenProps<
    AppStackParamsList,
    'Observation'
  >['navigation'];
}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ObservationHeaderRight observationId={observationId} />
      ),
    });
  }, [navigation, observationId]);
  const {projectId} = useActiveProject();
  const {data: observation} = useSingleDocByDocId({
    projectId: projectId,
    docType: 'observation',
    docId: observationId,
  });
  const {data: presets} = useManyDocs({projectId, docType: 'preset'});
  const {data: fieldsData} = useManyDocs({projectId, docType: 'field'});
  const {lat, lon, originalVersionId} = observation;
  const {data: deviceInfo} = useOwnDeviceInfo();
  const {data: createdByDeviceId} = useDocumentCreatedBy({
    projectId: projectId,
    originalVersionId,
  });
  const isMine =
    deviceInfo?.deviceId !== undefined &&
    createdByDeviceId !== undefined &&
    deviceInfo.deviceId === createdByDeviceId;

  const preset = presets.find(p =>
    p.fieldRefs.some(ref => ref.docId === observation.tags.presetId),
  );

  const fields = preset
    ? (preset.fieldRefs
        .map(ref => fieldsData.find(field => field.docId === ref.docId))
        .filter(Boolean) as Field[])
    : [];

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
          <BodyText variant="smallMeta" style={styles.time}>
            <FormattedObservationDate
              createdDate={observation.createdAt}
              variant="long"
            />
          </BodyText>
        </View>

        <View style={styles.section}>
          <PresetHeader preset={preset} style={{paddingHorizontal: 20}} />
          <React.Suspense fallback={<Loading />}>
            <TrackAccordian observationId={observationId} />
          </React.Suspense>
          {typeof observation.tags.notes === 'string' ? (
            <HeaderText variant="header3" style={styles.textNotes}>
              {observation.tags.notes}
            </HeaderText>
          ) : null}
          {attachments.length > 0 && (
            <MediaScrollView
              attachments={attachments}
              observationId={observationId}
            />
          )}
        </View>
        {fields.length > 0 && (
          <>
            <Divider />
            <FieldDetails
              style={{paddingHorizontal: 20}}
              observation={observation}
              fields={fields}
            />
          </>
        )}
        <View style={styles.divider} />
        <ButtonFields
          isMine={isMine}
          observationId={observationId}
          fields={fields}
        />
      </>
    </ScrollView>
  );
};

ObservationScreen.navTitle = m.title;

const styles = StyleSheet.create({
  root: {
    backgroundColor: WHITE,
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
    color: DARK_GREY,
    fontWeight: '100',
    padding: 20,
  },
  time: {
    backgroundColor: LIGHT_GREY,
    paddingVertical: 10,
    textAlign: 'center',
  },
});
