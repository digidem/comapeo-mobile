import {Observation} from '@mapeo/schema';
import MapboxGL from '@rnmapbox/maps';
import {useAllObservations} from '../../hooks/useAllObservations';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';
import {useCurrentTrackStore} from '../../hooks/tracks/useCurrentTrackStore';

const DEFAULT_MARKER_COLOR = '#F29D4B';

const layerStyles = {
  circleColor: DEFAULT_MARKER_COLOR,
  circleRadius: 5,
  circleStrokeColor: '#fff',
  circleStrokeWidth: 2,
};

export const ObservationMapLayer = () => {
  const observations = useAllObservations();
  const {navigate} = useNavigationFromHomeTabs();
  const isTracking = useCurrentTrackStore(state => state.isTracking);
  const featureCollection: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: mapObservationsToFeatures(observations),
  };

  return (
    <MapboxGL.ShapeSource
      onPress={event => {
        const properties = event.features[0]?.properties;
        if (!properties) return;
        if (!('id' in properties)) return;

        navigate('Observation', {observationId: properties.id});
      }}
      id="observations-source"
      shape={featureCollection}>
      <MapboxGL.CircleLayer
        aboveLayerID={isTracking ? 'routeFill' : undefined}
        id="circles"
        style={layerStyles}
      />
    </MapboxGL.ShapeSource>
  );
};

function mapObservationsToFeatures(
  observations: Observation[],
): GeoJSON.Feature[] {
  const accDefault: GeoJSON.Feature[] = [];
  const features: GeoJSON.Feature[] = observations.reduce((acc, obs) => {
    if (typeof obs.lon === 'number' && typeof obs.lat === 'number') {
      return [
        ...acc,
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [obs.lon, obs.lat],
          },
          properties: {
            id: obs.docId,
          },
        },
      ];
    }
    return acc;
  }, accDefault);

  return features;
}
