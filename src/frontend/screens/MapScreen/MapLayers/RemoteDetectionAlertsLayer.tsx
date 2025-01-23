import React from 'react';
import MapboxGL from '@rnmapbox/maps';

import {RemoteDetectionAlert} from '@comapeo/schema';
import {FeatureCollection} from 'geojson';
import {useRemoteDetectionAlerts} from '../../../hooks/server/remoteDetectionAlert';
import {flatten} from 'flat';
import {includeKeys} from 'filter-obj';

export const RemoteDectionAlertsMapLayer = () => {
  const {data: alerts} = useRemoteDetectionAlerts();

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
            'MultiPoint',
          ],
          ['has', 'metadata.alert_type'],
          ['has', 'month_detec'],
          ['has', 'year_detec'],
        ]}
        style={{
          textField: [
            'concat',
            ['get', 'metadata.alert_type'],
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
        id="comapeo-alerts-point"
        filter={['==', '$type', 'Point', 'MultiPoint']}
        style={{
          circleRadius: 5,
          circleColor: '#FF0000',
        }}
      />

      {/* Line Layer for LineStrings and MultiLineStrings */}
      <MapboxGL.LineLayer
        id="comapeo-alerts-linestring"
        filter={['in', '$type', 'LineString', 'MultiLineString']}
        style={{
          lineColor: '#FF0000',
          lineWidth: 3,
          lineOpacity: 0.8,
        }}
      />

      {/* Line Layer for Polygon Stroke */}
      <MapboxGL.LineLayer
        id="comapeo-alerts-polygon-stroke"
        filter={['in', '$type', 'Polygon', 'MultiPolygon']}
        style={{
          lineColor: '#FF0000',
          lineWidth: 2,
        }}
      />

      {/* Fill Layer for Polygon Fill */}
      <MapboxGL.FillLayer
        id="comapeo-alerts-polygon"
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
    features: alerts.map(alert => {
      const dateStart = new Date(alert.detectionDateStart);
      return {
        type: 'Feature',
        geometry: alert.geometry,
        properties: {
          ...flatten(
            includeKeys(alert, [
              'metadata',
              'detectionDateStart',
              'detectionDateEnd',
              'sourceId',
            ]),
          ),
          month_detec: dateStart.getMonth() + 1,
          year_detec: dateStart.getFullYear(),
        },
      };
    }),
  };
}
