import React from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Field, Observation} from '@mapeo/schema';
import {DARK_GREY} from '../../lib/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {defineMessages, useIntl} from 'react-intl';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useDeleteObservation} from '../../hooks/server/observations';
import {Text} from '../../sharedComponents/Text';
import Share from 'react-native-share';
import {useAttachmentUrlQueries} from '../../hooks/server/media.ts';
import {useObservationWithPreset} from '../../hooks/useObservationWithPreset.ts';
import {formatCoords} from '../../lib/utils.ts';
import {UIActivityIndicator} from 'react-native-indicators';
import {convertUrlToBase64} from '../../utils/base64.ts';
import {useState} from 'react';
import {usePersistedSettings} from '../../hooks/persistedState/usePersistedSettings.ts';
import * as Sentry from '@sentry/react-native';
import {CoordinateFormat} from '../../sharedTypes/index.ts';
import {getValueLabel} from '../../sharedComponents/FormattedData.tsx';

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
  shareMessageFieldNoAnswer: {
    id: 'screens.Observation.shareMessageFieldNoAnswer',
    defaultMessage: 'No answer',
    description:
      'Placeholder text for fields on an observation which are not answered',
  },
  fallbackCategoryName: {
    id: 'screens.Observation.fallbackCategoryName',
    defaultMessage: 'Observation',
    description:
      'Fallback name used when category name cannot be determined for observation',
  },
  comapeoAlert: {
    id: 'screens.Observation.comapeoAlert',
    defaultMessage: 'CoMapeo Alert',
  },
});

export const ButtonFields = ({
  fields,
  isMine,
  observationId,
}: {
  fields: Array<Field>;
  isMine: boolean;
  observationId: string;
}) => {
  const {formatMessage: t, formatDate} = useIntl();
  const navigation = useNavigationFromRoot();
  const deleteObservationMutation = useDeleteObservation();
  const {observation, preset} = useObservationWithPreset(observationId);
  const format = usePersistedSettings(store => store.coordinateFormat);
  const attachmentUrlQueries = useAttachmentUrlQueries(
    observation.attachments,
    'original',
  );
  const [isShareButtonLoading, setShareButtonLoading] = useState(false);

  function handlePressDelete() {
    Alert.alert(t(m.deleteTitle), undefined, [
      {
        text: t(m.cancel),
        onPress: () => {},
      },
      {
        text: t(m.confirm),
        onPress: () => {
          deleteObservationMutation.mutate({id: observationId});
          navigation.pop();
        },
      },
    ]);
  }

  async function handlePressShare() {
    const {attachments} = observation;
    setShareButtonLoading(true);
    const getValidUrls = (queries: typeof attachmentUrlQueries) => {
      const urls = queries
        .map(query => query.data?.url)
        .filter((url): url is string => url !== undefined && url !== null);

      return urls;
    };

    let urls: string[] = [];

    if (attachments.length > 0) {
      urls = getValidUrls(attachmentUrlQueries);

      if (urls.length === 0) {
        setShareButtonLoading(false);
        Alert.alert('Error', 'Unable to share this observation.');
        return;
      }
    }

    try {
      const base64Urls = await Promise.all(
        urls.map(url => convertUrlToBase64(url)),
      );

      const completedFields: Array<{label: string; value: string}> = [];

      for (const field of fields) {
        const value = observation.tags[field.tagKey];

        if (value === undefined || value === null || value === '') {
          continue;
        }

        const displayedValue =
          (Array.isArray(value) ? value : [value])
            .map(v => {
              return getValueLabel(v, field).trim();
            })
            .join(', ') || t(m.shareMessageFieldNoAnswer);

        completedFields.push({label: field.label, value: displayedValue});
      }

      await Share.open({
        subject: `${t(m.comapeoAlert)} — _*${preset ? preset.name : t(m.fallbackCategoryName)}*_ — ${formatDate(observation.createdAt, {format: 'long'})}`,
        title:
          base64Urls.length > 0 ? t(m.shareMediaTitle) : t(m.shareTextTitle),
        urls: base64Urls,
        message: createObservationShareMessage({
          categoryName: preset ? preset.name : t(m.fallbackCategoryName),
          coordinateFormat: format,
          completedFields,
          footerText: t(m.shareMessageFooter),
          observation,
          timestamp: formatDate(observation.createdAt, {format: 'long'}),
          titleText: t(m.shareMessageTitle),
        }),
      });
    } catch (err) {
      Sentry.captureException(err);
    } finally {
      setShareButtonLoading(false);
    }
  }

  return (
    <View style={styles.buttonContainer}>
      {isMine && (
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
  onPress: () => any;
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
      <Text style={styles.buttonText}>{title}</Text>
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

function createObservationShareMessage({
  categoryName,
  coordinateFormat,
  completedFields,
  footerText,
  observation,
  timestamp,
  titleText,
}: {
  categoryName?: string;
  coordinateFormat: CoordinateFormat;
  completedFields: Array<{label: string; value: string}>;
  footerText: string;
  observation: Observation;
  timestamp: string;
  titleText: string;
}): string {
  const header = titleText + (categoryName ? ` — _*${categoryName}*_` : '');

  const coordinates =
    observation.lat !== undefined && observation.lon !== undefined
      ? formatCoords({
          lon: observation.lon,
          lat: observation.lat,
          format: coordinateFormat,
        })
      : '';

  const notes =
    observation.tags.notes !== undefined && observation.tags.notes !== null
      ? `${observation.tags.notes}`
      : '';

  const displayedFields =
    completedFields.length > 0
      ? completedFields
          .map(({label, value}) => {
            return `*${label}*\n_${value}_`;
          })
          .join('\n\n')
      : '';

  const footer = `— ${footerText} —`;

  // No empty line between each item
  const sectionTop = [header, timestamp, coordinates]
    .filter(v => !!v)
    .join('\n');

  // One empty line between each item
  const sectionMiddle = [notes, displayedFields].filter(v => !!v).join('\n\n');

  // One empty line between each section
  return [sectionTop, sectionMiddle, footer].filter(s => !!s).join('\n\n');
}
