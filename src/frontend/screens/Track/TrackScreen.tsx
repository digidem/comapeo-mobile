import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import {BLACK, WHITE, DARK_GREY} from '../../lib/styles.ts';
import DeleteIcon from '../../images/DeleteTrack.svg';
import ShareIcon from '../../images/Share.svg';
import {TrackObservationList} from './TrackScreenObservationsList.tsx';
import {ActionButtons} from './TrackActionButtons.tsx';
import TrackIcon from '../../images/Track.svg';
import {TrackMap} from './TrackScreenMapPreview.tsx';
import {TrackEditDescriptionField} from '../TrackEdit/TrackEditDescriptionField.tsx';
import EditIcon from '../../images/Edit.svg';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft.tsx';
import {defineMessages, MessageDescriptor} from 'react-intl';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {NativeNavigationComponent} from '../../sharedTypes.ts';
import {useTrackQuery} from '../../hooks/server/track.ts';
import {useObservations} from '../../hooks/server/observations.ts';

const m = defineMessages({
  title: {
    id: 'screens.Track.title',
    defaultMessage: 'Track',
    description:
      'Title of track screen showing (non-editable) view of observation with map',
  },
  trackHeader: {
    id: 'screens.Track.trackHeader',
    defaultMessage: 'Track',
  },
});

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

export const TrackScreen: NativeNavigationComponent<'Track'> = ({
  route,
  navigation,
}) => {
  const [description, setDescription] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props: any) => (
        <CustomHeaderLeft headerBackButtonProps={props} tintColor={BLACK} />
      ),
      headerRight: () => (
        <Pressable>
          <EditIcon />
        </Pressable>
      ),
    });
  }, [navigation]);

  const {data: track} = useTrackQuery(route.params.trackId);
  const {data: observations} = useObservations();
  const trackObservations = observations.filter(observation =>
    track.refs.some(ref => ref.id === observation.docId),
  );
  const len = track.locations.length;
  const latitudes = track.locations.map(loc => loc.coords.latitude);
  const longitudes = track.locations.map(loc => loc.coords.longitude);
  let centerLat = (Math.min(...latitudes) + Math.max(...latitudes)) / 2;
  let centerLng = (Math.min(...longitudes) + Math.max(...longitudes)) / 2;
  let center = [centerLng, centerLat];
  return (
    <SafeAreaView style={styles.root}>
      <View>
        <TrackMap
          coords={center}
          locationHistory={track.locations.map(({timestamp, coords}) => ({
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp: parseInt(timestamp),
          }))}
        />
        <View style={styles.trackTitleWrapper}>
          <TrackIcon style={{marginRight: 10}} />
          <Text style={styles.trackTitle}>Tracks</Text>
        </View>
        <View style={styles.divider} />
        <ScrollView>
          <TrackObservationList observations={trackObservations} />
          <View style={styles.divider} />
          <TrackEditDescriptionField
            description={description}
            setDescription={setDescription}
          />
        </ScrollView>
      </View>
      <ActionButtons actions={actions} />
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

TrackScreen.navTitle = m.title;

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
