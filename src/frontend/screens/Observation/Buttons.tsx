import React, {useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Field} from '@comapeo/schema';
import {DARK_GREY} from '../../lib/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {defineMessages, useIntl} from 'react-intl';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useDeleteDocument, useProjectSettings} from '@comapeo/core-react';
import {useObservationWithPreset} from '../../hooks/useObservationWithPreset.ts';
import {formatCoords} from '../../lib/coordinateFormat.ts';
import {UIActivityIndicator} from 'react-native-indicators';
import {convertUrlToBase64} from '../../utils/base64.ts';
import * as Sentry from '@sentry/react-native';
import {getValueLabel} from '../../sharedComponents/FormattedData.tsx';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {BodyText} from '../../sharedComponents/Text/BodyText.tsx';
import {isSavedPhoto} from '../../lib/attachmentTypeChecks.ts';
import {useOpenShareDialog} from '../../hooks/share.ts';
import {useCoordinateFormat} from '../../contexts/CoordinateFormatStoreContext.ts';

const m = defineMessages({
  delete: {
    id: 'screens.Observation.ObservationView.delete',
    defaultMessage: 'Delete',
    description: 'Button to delete an observation',
  },
  share: {
    id: 'screens.Observation.ObservationView.share',
    defaultMessage: 'Share',
    description: 'Button to share an observation',
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
  shareMessageTitle: {
    id: 'screens.Observation.shareMessageTitle',
    defaultMessage: 'CoMapeo Alert',
  },
  shareMessageFooter: {
    id: 'screens.Observation.shareMessageFooter',
    defaultMessage: 'Sent from CoMapeo',
  },
  fallbackCategoryName: {
    id: 'screens.Observation.fallbackCategoryName',
    defaultMessage: 'Observation',
    description:
      'Fallback name used when category name cannot be determined for observation',
  },
  comapeoData: {
    id: 'screens.Observation.comapeoAlert',
    defaultMessage: 'CoMapeo data sent from *{projectName}*',
  },
  defaultProjectName: {
    id: 'screens.Observation.defaultProjectName',
    defaultMessage: 'My Project',
  },
  location: {
    id: 'screens.Observation.location',
    defaultMessage: 'Location:',
  },
  precision: {
    id: 'screens.Observation.precision',
    defaultMessage: 'Precision:',
  },
  details: {
    id: 'screens.Observation.details',
    defaultMessage: 'Details:',
  },
  description: {
    id: 'screens.Observation.description',
    defaultMessage: 'Description:',
  },
});

export const ButtonFields = ({
  fields,
  canDelete,
  observationId,
}: {
  fields: Array<Field>;
  canDelete: boolean;
  observationId: string;
}) => {
  const {formatMessage: t, formatDate} = useIntl();
  const navigation = useNavigationFromRoot();
  const {observation, preset} = useObservationWithPreset(observationId);
  const coordinateFormat = useCoordinateFormat();
  const [isShareButtonLoading, setShareButtonLoading] = useState(false);
  const {projectApi, projectId} = useActiveProject();
  const {
    data: {name},
  } = useProjectSettings({projectId});
  const {mutate: deleteObservationMutate, error: deleteObservationError} =
    useDeleteDocument({
      docType: 'observation',
      projectId: projectId,
    });
  const openShare = useOpenShareDialog();

  function handlePressDelete() {
    Alert.alert(t(m.deleteTitle), undefined, [
      {
        text: t(m.cancel),
        onPress: () => {},
      },
      {
        text: t(m.confirm),
        onPress: () => {
          deleteObservationMutate(
            {docId: observationId},
            {
              onSuccess: () => {
                navigation.pop();
              },
              onError: () => {
                Sentry.captureException(deleteObservationError);
              },
            },
          );
        },
      },
    ]);
  }

  async function fetchFreshUrls() {
    const {attachments} = observation;

    if (!attachments || attachments.length === 0) {
      return [];
    }
    const photoAttachments = attachments.filter(isSavedPhoto);
    if (photoAttachments.length === 0) {
      return [];
    }

    return await Promise.all(
      photoAttachments.map(async attachment => {
        return projectApi.$blobs.getUrl({
          driveId: attachment.driveDiscoveryId,
          name: attachment.name,
          type: 'photo',
          variant: 'original',
        });
      }),
    );
  }

  async function handlePressShare() {
    setShareButtonLoading(true);

    try {
      const urls = await fetchFreshUrls();
      const base64Urls =
        urls.length > 0
          ? await Promise.all(urls.map(url => convertUrlToBase64(url)))
          : [];

      const completedFields: Array<{label: string; value: string}> = [];
      for (const field of fields) {
        const value = observation.tags[field.tagKey];

        if (value === undefined || value === null || value === '') {
          continue;
        }

        const displayedValue = (Array.isArray(value) ? value : [value])
          .map(v => getValueLabel(v, field).trim())
          .join(', ');

        completedFields.push({label: field.label, value: displayedValue});
      }

      const subject = `${t(m.comapeoData, {projectName: name || t(m.defaultProjectName)})} - _*${preset ? preset.name : t(m.fallbackCategoryName)}*_`;

      const date = formatDate(observation.createdAt, {format: 'long'});

      const location =
        observation.lat !== undefined && observation.lon !== undefined
          ? `${t(m.location)} ${formatCoords({
              lon: observation.lon,
              lat: observation.lat,
              format: coordinateFormat,
            })}`
          : '';

      const precision = observation.metadata?.position?.coords?.accuracy
        ? `${t(m.precision)} ${observation.metadata.position.coords.accuracy}m`
        : '';

      const displayedFields = completedFields
        .map(({label, value}) => `${label}: ${value}`)
        .join(',\n    ');

      const notes = observation.tags.notes
        ? `${t(m.description)} ${observation.tags.notes}`
        : '';

      const body = [
        subject,
        date,
        location,
        precision,
        displayedFields && `[${displayedFields}]`,
        notes && `[${notes}]`,
      ];

      const footer = `— ${t(m.shareMessageFooter)} —`;

      await openShare.mutateAsync({
        subject: subject,
        title:
          base64Urls.length > 0 ? t(m.shareMediaTitle) : t(m.shareTextTitle),
        urls: !base64Urls.length ? undefined : base64Urls,
        message: `${[...body.filter(Boolean), ''].join('\n')}\n${footer}`,
        failOnCancel: false,
      });
    } catch (err) {
      Sentry.captureException(err);
    } finally {
      setShareButtonLoading(false);
    }
  }

  return (
    <View style={styles.buttonContainer}>
      {canDelete && (
        <Button
          iconName="delete"
          title={t(m.delete)}
          onPress={handlePressDelete}
        />
      )}
      <Button
        iconName="share"
        isLoading={isShareButtonLoading}
        title={t(m.share)}
        onPress={handlePressShare}
      />
    </View>
  );
};

type ButtonProps = {
  onPress: () => void;
  iconName: 'delete' | 'share';
  title: string;
  isLoading?: boolean;
};

const Button = ({onPress, isLoading, iconName, title}: ButtonProps) => (
  <TouchableOpacity onPress={onPress} style={{flex: 1}} disabled={isLoading}>
    <View style={styles.button}>
      {isLoading ? (
        <UIActivityIndicator />
      ) : (
        <MaterialIcons
          size={30}
          name={iconName}
          color={DARK_GREY}
          style={styles.buttonIcon}
        />
      )}
      <BodyText variant="smallMeta" style={styles.buttonText}>
        {title}
      </BodyText>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
