import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {DARK_GREY, RED} from '../../lib/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {defineMessages, useIntl} from 'react-intl';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useDeleteObservation} from '../../hooks/server/observations';
import {Text} from '../../sharedComponents/Text';
import Share from 'react-native-share';
import {Buffer} from 'buffer';
import {useAttachmentUrlQueries} from '../../hooks/server/media.ts';
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
  shareTitle: {
    id: 'screens.Observation.shareTitle',
    defaultMessage: 'Sharing observation',
    description: 'Title of dialog to share an observation',
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
  ).map(q => q.data);

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
    const attachments = attachmentUrlQueries.filter(url => !!url) as string[];
    const base64Urls = await Promise.all(
      attachments.map(async attachment => {
        const imageResponse = await fetch(attachment);
        const imageType = imageResponse.headers.get('content-type')!;

        const arrayBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        return `data:${imageType};base64,${base64}`;
      }),
    );

    await Share.open({
      title: t(m.shareTitle),
      urls: base64Urls,
      message: t(m.shareMessage, {
        category_name: preset.name,
        date: Date.now(),
        time: Date.now(),
        coordinates: `Lon ${observation.lon}, Lat ${observation.lat}`,
      }),
    });
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
