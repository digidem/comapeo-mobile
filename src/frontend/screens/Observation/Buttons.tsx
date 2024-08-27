import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
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
  shareMessage: {
    id: 'screens.Observation.shareMessage',
    defaultMessage:
      'CoMapeo Alert — _*{category_name}*_\n' +
      '{date, date, full} {time, time, long}\n' +
      '{coordinates}',
    description: 'Message that will be shared along with image',
  },
});

export const ButtonFields = ({
  isMine,
  observationId,
}: {
  isMine: boolean;
  observationId: string;
}) => {
  const {formatMessage: t} = useIntl();
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
    const {lon, lat, attachments} = observation;
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
        urls.map(url => convertUrlToBase64(url as string)),
      );

      await Share.open({
        title:
          base64Urls.length > 0 ? t(m.shareMediaTitle) : t(m.shareTextTitle),
        urls: base64Urls,
        message: t(m.shareMessage, {
          category_name: preset.name,
          date: Date.now(),
          time: Date.now(),
          coordinates:
            typeof lon === 'number' && typeof lat === 'number'
              ? formatCoords({lon, lat, format})
              : '',
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
