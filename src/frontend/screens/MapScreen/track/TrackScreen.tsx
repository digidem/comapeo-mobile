import React from 'react';
import {StyleSheet, View, Dimensions, Text} from 'react-native';
import {BLACK, WHITE} from '../../../lib/styles';
import DeleteIcon from '../../../images/DeleteTrack.svg';
import ShareIcon from '../../../images/Share.svg';
import MapboxGL from '@rnmapbox/maps';
import {MAP_STYLE} from '..';
import {DisplayedTrackPathLayer} from './DisplayedTrackPathLayer';
import {TrackObservation} from './TrackObservations';
import {ActionsButton} from './actions/ActionsButton';
import TrackIcon from '../../../images/Track.svg';

export const TrackScreen = () => {
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

  return (
    <>
      <View>
        <MapboxGL.MapView
          style={styles.map}
          zoomEnabled={false}
          logoEnabled={false}
          scrollEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          compassEnabled={false}
          scaleBarEnabled={false}
          styleURL={MAP_STYLE}>
          <MapboxGL.Camera
            centerCoordinate={[19.93656, 50.06472]}
            zoomLevel={12}
            animationMode="none"
          />
          <DisplayedTrackPathLayer
            onPress={() => {}}
            locationHistory={[
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
            ]}
          />
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
      <ActionsButton actions={actions} />
    </>
  );
};

const MAP_HEIGHT = 250;

const ICON_OFFSET = {x: 22, y: 21};

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
