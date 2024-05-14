import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {DARK_GREY, RED} from '../../lib/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {defineMessages, useIntl} from 'react-intl';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useDeleteObservation} from '../../hooks/server/observations';
import {Text} from '../../sharedComponents/Text';
import Share from 'react-native-share';
import {
  useAttachmentsBase64Query,
  useAttachmentUrlQueries,
} from '../../hooks/server/media.ts';
import {useObservationWithPreset} from '../../hooks/useObservationWithPreset.ts';

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
      'Mapeo Alert — {category_name}\n' +
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
  const attachmentUrlQueries = useAttachmentUrlQueries(
    observation.attachments,
    'original',
  );
  const attachmentBase64Queries = useAttachmentsBase64Query(
    attachmentUrlQueries.filter(res => !!res.data).map(res => res.data!),
  );

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
    const base64Urls = attachmentBase64Queries
      .filter(q => !!q.data)
      .map(q => q.data!);
    Share.open({
      title: base64Urls.length > 0 ? t(m.shareMediaTitle) : t(m.shareTextTitle),
      urls: base64Urls,
      message: t(m.shareMessage, {
        category_name: preset.name,
        date: Date.now(),
        time: Date.now(),
        coordinates: `Lon ${observation.lon}, Lat ${observation.lat}`,
      }),
    }).catch(() => {});
  }

  return (
    <View style={styles.buttonContainer}>
      {isMine && (
        <Button
          iconName="delete"
          title={t(m.delete)}
          color={RED}
          onPress={handlePressDelete}
        />
      )}
      <Button
        iconName="share"
        title={t(m.share)}
        color={RED}
        onPress={handlePressShare}
      />
    </View>
  );
};

type ButtonProps = {
  onPress: () => any;
  color: string;
  iconName: 'delete' | 'share';
  title: string;
};

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
