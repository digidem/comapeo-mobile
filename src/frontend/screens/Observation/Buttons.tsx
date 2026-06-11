import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Field} from '@comapeo/schema';
import {DARK_GREY} from '../../lib/styles';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {defineMessages, useIntl} from 'react-intl';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useProjectSettings} from '@comapeo/core-react';
import {useObservationWithPreset} from '../../hooks/useObservationWithPreset.ts';
import {formatCoords} from '../../lib/coordinateFormat.ts';
import {UIActivityIndicator} from 'react-native-indicators';
import {convertUrlToBase64} from '../../utils/base64.ts';
import * as Sentry from '@sentry/react-native';
import {getFieldAnswerText} from '../../sharedComponents/FormattedData.tsx';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {BodyText} from '../../sharedComponents/Text/BodyText.tsx';
import {isSavedPhoto} from '../../lib/attachmentTypeChecks.ts';
import {useOpenShareDialog} from '../../hooks/share.ts';
import {useCoordinateFormat} from '../../contexts/CoordinateFormatStoreContext.ts';
import {useUnitSystem} from '../../contexts/UnitSystemStoreContext';
import {metersOrConversion} from '../../lib/unitConversion';
import {useCanEditOrDelete} from '../../hooks/server/useCanEditOrDelete.ts';
const m = defineMessages({
  delete: {
    id: '$1screens.Observation.ObservationView.delete',
    defaultMessage: 'Delete',
    description: 'Button to delete an observation',
  },
  share: {
    id: '$1screens.Observation.ObservationView.share',
    defaultMessage: 'Share',
    description: 'Button to share an observation',
  },
  shareTextTitle: {
    id: '$1screens.Observation.shareTextTitle',
    defaultMessage: 'Sharing text',
    description: 'Title of dialog to share an observation without media',
  },
  shareMediaTitle: {
    id: '$1screens.Observation.shareMediaTitle',
    defaultMessage: 'Sharing image',
    description: 'Title of dialog to share an observation with media',
  },
  shareMessageFooter: {
    id: '$1screens.Observation.shareMessageFooter',
    defaultMessage: 'Sent from CoMapeo',
  },
  fallbackCategoryName: {
    id: '$1screens.Observation.fallbackCategoryName',
    defaultMessage: 'Observation',
    description:
      'Fallback name used when category name cannot be determined for observation',
  },
  comapeoData: {
    id: '$1screens.Observation.comapeoAlert',
    defaultMessage: 'CoMapeo data sent from *{projectName}*',
  },
  defaultProjectName: {
    id: '$1screens.Observation.defaultProjectName',
    defaultMessage: 'My Project',
  },
  location: {
    id: '$1screens.Observation.location',
    defaultMessage: 'Location:',
  },
  precision: {
    id: '$1screens.Observation.precision',
    defaultMessage: 'Precision:',
  },
  description: {
    id: '$1screens.Observation.description',
    defaultMessage: 'Description:',
  },
});

export const ButtonFields = ({
  fields,
  observationId,
}: {
  fields: Array<Field>;
  observationId: string;
}) => {
  const {formatMessage: t, formatDate} = useIntl();
  const navigation = useNavigationFromRoot();
  const {observation, preset} = useObservationWithPreset(observationId);
  const coordinateFormat = useCoordinateFormat();
  const unitSystem = useUnitSystem();
  const [isShareButtonLoading, setShareButtonLoading] = useState(false);
  const {projectApi, projectId} = useActiveProject();
  const {
    data: {name},
  } = useProjectSettings({projectId});
  const openShare = useOpenShareDialog();
  const canDelete = useCanEditOrDelete(observation.originalVersionId);

  function handlePressDelete() {
    navigation.navigate('ConfirmDeleteObservationBottomSheet', {observationId});
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

        const displayedValue = getFieldAnswerText({
          fieldOptions: field.options,
          tagValue: value,
        });

        if (!displayedValue) continue;

        completedFields.push({label: field.label, value: displayedValue});
      }

      const date = formatDate(observation.createdAt, {format: 'long'});

      const subject =
        `${t(m.comapeoData, {projectName: name || t(m.defaultProjectName)})}` +
        ` - _*${preset ? preset.name : t(m.fallbackCategoryName)}*_` +
        ` - ${date}`;

      const location =
        observation.lat !== undefined && observation.lon !== undefined
          ? `${t(m.location)} ${formatCoords({
              lon: observation.lon,
              lat: observation.lat,
              format: coordinateFormat,
            })}`
          : '';

      const precision = observation.metadata?.position?.coords?.accuracy
        ? (() => {
            const {value, unit} = metersOrConversion(
              observation.metadata.position.coords.accuracy,
              unitSystem,
            );
            return `${t(m.precision)} ${Math.round(value)} ${unit}`;
          })()
        : '';

      const displayedFields = completedFields
        .map(({label, value}) => `${label}: ${value}`)
        .join(',\n    ');

      const notes = observation.tags.notes
        ? `${t(m.description)} ${observation.tags.notes}`
        : '';

      const body = [
        subject,
        location,
        precision,
        displayedFields && `[${displayedFields}]`,
        notes && `[${notes}]`,
      ];

      const footer = `— ${t(m.shareMessageFooter)} —`;

      await openShare.mutateAsync({
        subject,
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
