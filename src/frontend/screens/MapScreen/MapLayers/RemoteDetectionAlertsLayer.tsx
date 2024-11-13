import React from 'react';
import MapboxGL from '@rnmapbox/maps';

import {RemoteDetectionAlert} from '@comapeo/schema';
import {FeatureCollection} from 'geojson';
import {useRemoteDectionAlerts} from '../../../hooks/server/remoteDetectionAlert';

export const RemoteDectionAlertsMapLayer = () => {
  const {data: alerts} = useRemoteDectionAlerts();

  if (!alerts) {
    return null;
  }

  return (
    <MapboxGL.ShapeSource
      id="alerts-source"
      shape={convertRemoteDetectionAlertsToFeatures(alerts)}>
      {/* Symbol Layer for Labels */}
      <MapboxGL.SymbolLayer
        id="mapeo-alerts-label"
        filter={[
          'all',
          [
            'in',
            '$type',
            'Polygon',
            'LineString',
            'Point',
            'MultiLineString',
            'MultiPolygon',
          ],
          ['has', 'alert_type'],
          ['has', 'month_detec'],
          ['has', 'year_detec'],
        ]}
        style={{
          textField: [
            'concat',
            ['get', 'alert_type'],
            ' (',
            ['get', 'month_detec'],
            '-',
            ['get', 'year_detec'],
            ')',
          ],
          textFont: ['Open Sans Regular'],
          textOffset: [0, 0.5],
          textAnchor: 'top',
          textColor: '#FFFFFF',
          textHaloColor: '#000000',
          textHaloWidth: 1,
          textHaloBlur: 1,
        }}
      />

      {/* Circle Layer for Points */}
      <MapboxGL.CircleLayer
        id="mapeo-alerts-point"
        filter={['==', '$type', 'Point']}
        style={{
          circleRadius: 5,
          circleColor: '#FF0000',
        }}
      />

      {/* Line Layer for LineStrings and MultiLineStrings */}
      <MapboxGL.LineLayer
        id="mapeo-alerts-linestring"
        filter={['in', '$type', 'LineString', 'MultiLineString']}
        style={{
          lineColor: '#FF0000',
          lineWidth: 3,
          lineOpacity: 0.8,
        }}
      />

      {/* Line Layer for Polygon Stroke */}
      <MapboxGL.LineLayer
        id="mapeo-alerts-polygon-stroke"
        filter={['in', '$type', 'Polygon', 'MultiPolygon']}
        style={{
          lineColor: '#FF0000',
          lineWidth: 2,
        }}
      />

      {/* Fill Layer for Polygon Fill */}
      <MapboxGL.FillLayer
        id="mapeo-alerts-polygon"
        filter={['in', '$type', 'Polygon', 'MultiPolygon']}
        style={{
          fillColor: '#FF0000',
          fillOpacity: 0.5,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

function convertRemoteDetectionAlertsToFeatures(
  alerts: RemoteDetectionAlert[],
): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: alerts.map(alert => ({
      type: 'Feature',
      geometry: alert.geometry,
      id: alert.sourceId,
      properties: {
        alert,
      },
    })),
  };
}
