import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import {BLACK, WHITE, DARK_GREY} from '../../../lib/styles';
import DeleteIcon from '../../../images/DeleteTrack.svg';
import ShareIcon from '../../../images/Share.svg';
import {TrackObservation} from './TrackObservations';
import {ActionsButton} from './actions/ActionsButton';
import TrackIcon from '../../../images/Track.svg';
import {TrackMap} from './TrackMap';
import {TrackDescriptionField} from './saveTrack/TrackDescriptionField';
import EditIcon from '../../../images/Edit.svg';
import {useNavigation} from '@react-navigation/native';
import {CustomHeaderLeft} from '../../../sharedComponents/CustomHeaderLeft';
import {defineMessages, MessageDescriptor} from 'react-intl';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

const m = defineMessages({
  trackHeader: {
    id: 'screens.Track.trackHeader',
    defaultMessage: 'Observation',
  },
});

const data = [
  {
    attachments: [],
    createdAt: '2024-04-22T12:17:13.523Z',
    createdBy:
      'bd5b49edc8f0b4546776cbc4a6b50b0dae02b4496e08f4e23a93fc2afee9ebc4',
    deleted: false,
    docId: '5c41c56e239a2e73b3906b7339b0adc9dabfdd2e5ebb10f2947bae8af10f29bd',
    forks: [],
    lat: 50.0590383,
    links: [],
    lon: 19.9401073,
    metadata: {
      position: {
        coords: [],
        mocked: false,
        timestamp: '1970-01-01T00:00:00.000Z',
      },
    },
    refs: [],
    schemaName: 'observation',
    tags: {notes: 'bla bla', place: 'village'},
    updatedAt: '2024-04-22T12:17:13.523Z',
    versionId:
      'bd5b49edc8f0b4546776cbc4a6b50b0dae02b4496e08f4e23a93fc2afee9ebc4/0',
  },
];

const locationHistory = [
  {
    latitude: 50.06279,
    longitude: 19.93688,
    timestamp: 1713776455589,
  },
  {
    latitude: 50.0629127,
    longitude: 19.9365866,
    timestamp: 1713776463925,
  },
  {
    latitude: 50.0630497,
    longitude: 19.9362622,
    timestamp: 1713776472948,
  },
  {
    latitude: 50.0631868,
    longitude: 19.9359375,
    timestamp: 1713776481975,
  },
  {
    latitude: 50.063322,
    longitude: 19.9356318,
    timestamp: 1713776491000,
  },
  {
    latitude: 50.0635501,
    longitude: 19.9357714,
    timestamp: 1713776502927,
  },
  {
    latitude: 50.063752,
    longitude: 19.9359579,
    timestamp: 1713776512933,
  },
  {
    latitude: 50.0639543,
    longitude: 19.9361445,
    timestamp: 1713776522928,
  },
  {
    latitude: 50.0640681,
    longitude: 19.9358108,
    timestamp: 1713776535146,
  },
  {
    latitude: 50.0641695,
    longitude: 19.9354987,
    timestamp: 1713776545191,
  },
  {
    latitude: 50.0644038,
    longitude: 19.9356067,
    timestamp: 1713776564253,
  },
  {
    latitude: 50.0645096,
    longitude: 19.9359267,
    timestamp: 1713776571291,
  },
  {
    latitude: 50.0646138,
    longitude: 19.9362404,
    timestamp: 1713776578326,
  },
  {
    latitude: 50.06472,
    longitude: 19.93656,
    timestamp: 1713776585347,
  },
  {
    latitude: 50.0648397,
    longitude: 19.9368859,
    timestamp: 1713776591980,
  },
  {
    latitude: 50.0646521,
    longitude: 19.9370786,
    timestamp: 1713776599947,
  },
  {
    latitude: 50.0645045,
    longitude: 19.9373671,
    timestamp: 1713776608427,
  },
  {
    latitude: 50.064395,
    longitude: 19.9376829,
    timestamp: 1713776615429,
  },
  {
    latitude: 50.0642964,
    longitude: 19.9380234,
    timestamp: 1713776623435,
  },
  {
    latitude: 50.0642002,
    longitude: 19.9383574,
    timestamp: 1713776631455,
  },
  {
    latitude: 50.0641016,
    longitude: 19.9387055,
    timestamp: 1713776639483,
  },
];

const actions = [
  {
    icon: DeleteIcon,
    text: 'Delete',
    onPress: () => {},
  },
  {
    icon: ShareIcon,
    text: 'Share',
    onPress: () => {},
  },
];

export const TrackScreen = () => {
  const navigation = useNavigation();
  const [description, setDescription] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props: any) =>
        navigation.canGoBack() && (
          <CustomHeaderLeft headerBackButtonProps={props} tintColor={BLACK} />
        ),
      headerRight: () => (
        <Pressable>
          <EditIcon />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.root}>
      <View>
        <TrackMap
          coords={[19.93656, 50.06472]}
          locationHistory={locationHistory}
        />
        <View style={styles.trackTitleWrapper}>
          <TrackIcon style={{marginRight: 10}} />
          <Text style={styles.trackTitle}>Tracks</Text>
        </View>
        <View style={styles.divider} />
        <ScrollView>
          <TrackObservation observationsAmount={4} observations={data} />
          <View style={styles.divider} />
          <TrackDescriptionField
            description={description}
            setDescription={setDescription}
          />
        </ScrollView>
      </View>
      <ActionsButton actions={actions} />
    </SafeAreaView>
  );
};

export const createTrackNavigationOptions = ({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) => {
  return (): NativeStackNavigationOptions => {
    return {
      headerTitle: intl(m.trackHeader),
      headerTransparent: true,
      headerTintColor: DARK_GREY,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'transparent',
      },
    };
  };
};

export const styles = StyleSheet.create({
  positionText: {
    fontSize: 12,
    color: BLACK,
    fontWeight: '700',
  },
  root: {
    backgroundColor: WHITE,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  divider: {borderBottomColor: '#CCCCD6', borderBottomWidth: 1},
  trackTitleWrapper: {
    marginVertical: 10,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackTitle: {fontSize: 20, fontWeight: '700', color: DARK_GREY},
});
