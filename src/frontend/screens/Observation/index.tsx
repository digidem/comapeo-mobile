import * as React from 'react';

import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {defineMessages} from 'react-intl';
import {WHITE, DARK_GREY, BLUE_GREY, VERY_LIGHT_GREY} from '../../lib/styles';

import {FormattedObservationDate} from '../../sharedComponents/FormattedData';
import {PresetHeader} from './PresetHeader';
import {FieldDetails} from './FieldDetails';
import {InsetMapView} from './InsetMapView';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {ObservationHeaderRight} from './ObservationHeaderRight';
import {useManyDocs} from '@comapeo/core-react';
import {SavedPhoto} from '../../contexts/PhotoPromiseContext/types.ts';
import {ButtonFields} from './Buttons.tsx';
import {AudioAttachment} from '../../sharedTypes/audio.ts';
import {isSavedPhoto, isAudioAttachment} from '../../lib/attachmentTypeChecks';
import {TrackAccordian} from './TrackAccordian.tsx';
import {Divider} from '../../sharedComponents/Divider.tsx';
import {BodyText} from '../../sharedComponents/Text/BodyText.tsx';
import {HeaderText} from '../../sharedComponents/Text/HeaderText.tsx';
import VerifiedBadge from '../../images/verifiedBadge.svg';
import {Loading} from '../../sharedComponents/Loading.tsx';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useObservationWithPreset} from '../../hooks/useObservationWithPreset';
import {Field} from '@comapeo/schema';
import {HorizontalScrollView} from '../../sharedComponents/HorizontalScrollView.tsx';
import {
  GAP,
  MIN_WIDTH,
  ThumbnailLoader,
} from '../../sharedComponents/Thumbnails/ThumbnailContainer.tsx';
import {SavedPhotoThumbnailImage} from '../../sharedComponents/Thumbnails/PhotoThumbnail.tsx';
import {AudioSavedThumbnail} from '../../sharedComponents/Thumbnails/AudioSavedThumbnail.tsx';
import {useDraftObservation} from '../../hooks/useDraftObservation.ts';
import {useCanEditOrDelete} from '../../hooks/server/useCanEditOrDelete.ts';

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
  const {projectId} = useActiveProject();
  const {observation, preset} = useObservationWithPreset(observationId);
  const {existingObservationToDraft} = useDraftObservation();

  const {data: fieldsData} = useManyDocs({projectId, docType: 'field'});
  const {lat, lon, metadata} = observation;

  const fields = preset
    ? (preset.fieldRefs
        .map(ref => fieldsData.find(field => field.docId === ref.docId))
        .filter(Boolean) as Field[])
    : [];

  const attachments = observation.attachments.filter(
    (attachment): attachment is SavedPhoto | AudioAttachment =>
      isSavedPhoto(attachment) || isAudioAttachment(attachment),
  );

  const canEdit = useCanEditOrDelete(observation.originalVersionId);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (canEdit) {
          return (
            <ObservationHeaderRight
              canEdit={canEdit}
              setObservationToStoreAndNavigateToEdit={() => {
                existingObservationToDraft(observation, preset);
                navigation.navigate('ObservationEdit');
              }}
            />
          );
        }

        return <ObservationHeaderRight canEdit={canEdit} />;
      },
    });
  }, [canEdit, navigation, observation, existingObservationToDraft, preset]);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}>
      <>
        {/* check lat and lon are undefined. We cannot do `!lat && !lon` as 0 is a valid number but a falsy value */}
        {lat !== undefined && lon !== undefined && (
          <InsetMapView
            accuracy={metadata?.position?.coords.accuracy}
            observationId={observationId}
            lat={lat}
            lon={lon}
          />
        )}
        <TouchableOpacity
          accessibilityLabel="Open Observation Metadata"
          onPress={() => {
            navigation.navigate('ObservationMetadata', {
              observationId,
            });
          }}
          style={styles.time}>
          <BodyText variant="smallMeta">
            <FormattedObservationDate
              createdDate={observation.createdAt}
              variant="long"
            />
          </BodyText>
          <VerifiedBadge style={{marginLeft: 10}} />
        </TouchableOpacity>

        <View style={styles.section}>
          <PresetHeader preset={preset} style={{paddingHorizontal: 20}} />
          <React.Suspense fallback={<Loading />}>
            <TrackAccordian observationId={observationId} />
          </React.Suspense>
          {observation?.tags?.notes ? (
            <HeaderText variant="header3" style={styles.textNotes}>
              {observation.tags.notes}
            </HeaderText>
          ) : null}
          {attachments.length > 0 && (
            <HorizontalScrollView
              shouldShowLastItems={false}
              minItemWidth={MIN_WIDTH}
              gap={GAP}
              renderChildren={size => (
                <>
                  {attachments.map(att => {
                    if (isSavedPhoto(att)) {
                      return (
                        <React.Suspense
                          key={att.driveDiscoveryId + att.hash + att.type}
                          fallback={<ThumbnailLoader size={size} />}>
                          <SavedPhotoThumbnailImage
                            size={size}
                            photo={att}
                            onPress={() => {
                              navigation.navigate('AttachedPhotoPreviewModal', {
                                photo: att,
                                observationDocId: observationId,
                              });
                            }}
                          />
                        </React.Suspense>
                      );
                    }

                    if (isAudioAttachment(att)) {
                      return (
                        <AudioSavedThumbnail
                          size={size}
                          key={att.driveDiscoveryId + att.hash + att.type}
                          audio={att}
                          observationId={observationId}
                        />
                      );
                    }
                  })}
                </>
              )}
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
        <ButtonFields observationId={observationId} fields={fields} />
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
    backgroundColor: VERY_LIGHT_GREY,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
