import React from 'react';
import {StyleSheet, View, Dimensions, Image, SafeAreaView} from 'react-native';
import {Text} from '../../../sharedComponents/Text';
import {WHITE} from '../../../lib/styles';
import TrackIcon from '../../../images/Track.svg';
import DeleteIcon from '../../../images/DeleteTrack.svg';
import ShareIcon from '../../../images/Share.svg';
import {TrackObservation} from './TrackObservations';
import MapboxGL from '@rnmapbox/maps';
import {MAP_STYLE} from '..';
import {ActionsButton} from './actions/ActionsButton';
import {TrackPathLayer} from './TrackPathLayer';
import {DisplayedTrackPathLayer} from './DisplayedTrackPathLayer';

export const TrackScreen = () => {
  const [isFinishedLoading, setIsFinishedLoading] = React.useState(false);

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

  function handleDidFinishLoadingStyle() {
    setIsFinishedLoading(true);
  }
  console.log(isFinishedLoading, 'isFinishedLoading');
  return (
    <>
      <SafeAreaView style={styles.root}>
        <View>
          <Image
            style={styles.mapIcon}
            source={require('../../../images/observation-icon.png')}
          />
          <MapboxGL.MapView
            style={styles.map}
            zoomEnabled={false}
            logoEnabled={false}
            scrollEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            compassEnabled={false}
            scaleBarEnabled={false}
            onDidFinishLoadingStyle={handleDidFinishLoadingStyle}
            styleURL={MAP_STYLE}>
            <MapboxGL.Camera
              centerCoordinate={[52, 22]}
              zoomLevel={12}
              animationMode="none"
            />
            {isFinishedLoading && (
              <DisplayedTrackPathLayer
                onPress={() => {}}
                locationHistory={[
                  {
                    latitude: 52.0,
                    longitude: 22.0,
                    timestamp: 1647289200,
                  },
                  {
                    latitude: 52.001,
                    longitude: 22.001,
                    timestamp: 1647292800,
                  },
                  {
                    latitude: 52.002,
                    longitude: 22.002,
                    timestamp: 1647296400,
                  },
                  {
                    latitude: 52.003,
                    longitude: 22.003,
                    timestamp: 1647300000,
                  },
                  {
                    latitude: 52.004,
                    longitude: 22.004,
                    timestamp: 1647303600,
                  },
                  {
                    latitude: 52.005,
                    longitude: 22.005,
                    timestamp: 1647307200,
                  },
                  {
                    latitude: 52.006,
                    longitude: 22.006,
                    timestamp: 1647310800,
                  },
                  {
                    latitude: 52.007,
                    longitude: 22.007,
                    timestamp: 1647314400,
                  },
                  {
                    latitude: 52.008,
                    longitude: 22.008,
                    timestamp: 1647318000,
                  },
                  {
                    latitude: 52.009,
                    longitude: 22.009,
                    timestamp: 1647321600,
                  },
                ]}
              />
            )}
          </MapboxGL.MapView>
        </View>
        <View style={styles.trackTitle}>
          <TrackIcon style={{marginRight: 10}} />
          <Text style={{fontSize: 20, fontWeight: '700'}}>Tracks</Text>
        </View>
        <TrackObservation
          observationsAmount={4}
          observations={[
            {
              attachments: [],
              createdAt: '2024-04-19T07:37:42.271Z',
              createdBy:
                'b4e82acc88024d5481b2949e771227ee744b32014e2e7465966c8ba52ecba630',
              deleted: false,
              docId:
                '968d05026e6e20e997ea80abcf4dc027362fd7ec3a3113025ddc15bb7dba77bd',
              forks: [
                'b4e82acc88024d5481b2949e771227ee744b32014e2e7465966c8ba52ecba630/0',
                'b4e82acc88024d5481b2949e771227ee744b32014e2e7465966c8ba52ecba630/0',
                'b4e82acc88024d5481b2949e771227ee744b32014e2e7465966c8ba52ecba630/0',
                'b4e82acc88024d5481b2949e771227ee744b32014e2e7465966c8ba52ecba630/0',
                'b4e82acc88024d5481b2949e771227ee744b32014e2e7465966c8ba52ecba630/0',
                'b4e82acc88024d5481b2949e771227ee744b32014e2e7465966c8ba52ecba630/0',
                'b4e82acc88024d5481b2949e771227ee744b32014e2e7465966c8ba52ecba630/0',
                'b4e82acc88024d5481b2949e771227ee744b32014e2e7465966c8ba52ecba630/0',
                'b4e82acc88024d5481b2949e771227ee744b32014e2e7465966c8ba52ecba630/0',
                'b4e82acc88024d5481b2949e771227ee744b32014e2e7465966c8ba52ecba630/0',
              ],
              lat: 50.0590383,
              links: [],
              lon: 19.9399929,
              metadata: {
                position: {
                  coords: [{latitude: 22, longitude: 44}],
                  mocked: false,
                  timestamp: '1970-01-01T00:00:00.000Z',
                },
              },
              refs: [],
              schemaName: 'observation',
              tags: {aeroway: 'airstrip', type: 'aeroway'},
              updatedAt: '2024-04-19T07:37:42.271Z',
              versionId:
                'b4e82acc88024d5481b2949e771227ee744b32014e2e7465966c8ba52ecba630/0',
            },
          ]}
        />
      </SafeAreaView>
      <ActionsButton actions={actions} />
    </>
  );
};

const MAP_HEIGHT = 250;

const ICON_OFFSET = {x: 22, y: 21};

export const styles = StyleSheet.create({
  root: {
    backgroundColor: WHITE,
    flex: 1,
    flexDirection: 'column',
  },
  scrollContent: {minHeight: '100%'},
  section: {
    flex: 1,
    marginHorizontal: 15,
    paddingVertical: 15,
  },
  trackTitle: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#CCCCD6',
    borderBottomWidth: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coords: {
    zIndex: 10,
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: 15,
    bottom: 15,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 0,
    paddingBottom: 10,
    backgroundColor: WHITE,
  },
  coordsPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: WHITE,
    top: -10,
  },
  map: {
    height: MAP_HEIGHT,
  },
  mapIcon: {
    position: 'absolute',
    zIndex: 11,
    width: 44,
    height: 75,
    left: Dimensions.get('screen').width / 2 - ICON_OFFSET.x,
    bottom: MAP_HEIGHT / 2 - ICON_OFFSET.y,
  },
});
