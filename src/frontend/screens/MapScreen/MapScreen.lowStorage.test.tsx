import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {render, screen} from '@testing-library/react-native';

import type {MapeoManager} from '@comapeo/core';
import type {MapeoClientApi} from '@comapeo/ipc';

import {
  createManager,
  setUpIPC,
} from '../../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../../tests/integration/helpers/react';
import {useStorageStatusStore} from '../../contexts/StorageStatusStoreContext';

jest.mock('@rnmapbox/maps', () => {
  const React = require('react');
  const {View} = require('react-native');
  const Stub = (
    props: {children?: React.ReactNode} & Record<string, unknown>,
  ) => {
    const {children, ...rest} = props || {};
    return React.createElement(View, rest, children);
  };

  const LineJoin = {Round: 'round', Bevel: 'bevel', Miter: 'miter'};
  const LineCap = {Round: 'round', Butt: 'butt', Square: 'square'};

  return {
    __esModule: true,
    default: {
      MapView: Stub,
      Camera: Stub,
      UserLocation: Stub,
      ShapeSource: Stub,
      LineLayer: Stub,
      setAccessToken: jest.fn(),
      setTelemetryEnabled: jest.fn(),
    },
    LineJoin,
    LineCap,
  };
});

jest.mock('react-native-scale-bar', () => 'ScaleBar');

jest.mock('../../hooks/server/maps', () => ({
  useMapStyleJsonUrl: () => ({data: undefined}),
}));

jest.mock('../../hooks/useCurrentTime', () => ({
  useCurrentTime: () => new Date(),
}));

jest.mock('./MapLayers/ObservationMapLayer', () => ({
  ObservationMapLayer: () => null,
}));
jest.mock('./MapLayers/TracksMapLayer', () => ({
  TracksMapLayer: () => null,
}));
jest.mock('./CurrentTrack/CurrentTrackMapLayer', () => ({
  CurrentTrackMapLayer: () => null,
}));
jest.mock('./MapLayers/RemoteDetectionAlertsLayer', () => ({
  RemoteDetectionAlertsMapLayer: () => null,
}));
jest.mock('./CurrentTrack/UserTooltipMarker', () => ({
  UserTooltipMarker: () => null,
}));

process.env.MAPBOX_ACCESS_TOKEN = 'test-token';

import {MapScreen} from '.';

const Stack = createNativeStackNavigator<{Map: undefined}>();

describe('MapScreen low-storage banner', () => {
  let manager: MapeoManager;
  let client: MapeoClientApi;
  let onTeardown: Array<() => unknown> = [];

  beforeEach(async () => {
    onTeardown = [];

    const {manager: mgr, fastifyController} = await createManager({
      name: 'test-device',
      deviceType: 'mobile',
    });
    manager = mgr;

    await fastifyController.start();
    onTeardown.push(() => fastifyController.stop());

    const ipc = setUpIPC({manager});
    client = ipc.client;
    onTeardown.push(ipc.stop);

    const projectId = await client.createProject({name: 'Test Project'});
    await client.getProject(projectId);
  });

  afterEach(async () => {
    useStorageStatusStore.setState({
      freeBytes: null,
      totalBytes: null,
      isLow: false,
      dismissedMapBannerSession: false,
    });

    for (const fn of onTeardown) await fn();
  });

  function renderMap({isOnline = true}: {isOnline?: boolean} = {}) {
    const app = createAppProvidersWrapper({mapeoApi: client, isOnline});
    onTeardown.push(app.teardown);

    const r = render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Map" component={MapScreen} />
        </Stack.Navigator>
      </NavigationContainer>,
      {wrapper: app.wrapper},
    );

    const safeUnmount = async () => {
      r.unmount();
      await new Promise(res => setTimeout(res, 0));
    };
    onTeardown.unshift(safeUnmount);

    return r;
  }

  it('shows banner when isLow is true and not dismissed', async () => {
    renderMap();

    useStorageStatusStore.getState().setPartial({
      isLow: true,
      dismissedMapBannerSession: false,
    });

    expect(await screen.findByTestId('MAP:low-storage-banner')).toBeTruthy();
  });

  it('hides banner when dismissed this session', async () => {
    renderMap();

    useStorageStatusStore.getState().setPartial({
      isLow: true,
      dismissedMapBannerSession: true,
    });

    expect(screen.queryByTestId('MAP:low-storage-banner')).toBeNull();
  });

  it('resets dismissal when storage recovers (banner re-appears on next low)', async () => {
    renderMap();

    useStorageStatusStore.getState().setPartial({
      isLow: true,
      dismissedMapBannerSession: true,
    });
    expect(screen.queryByTestId('MAP:low-storage-banner')).toBeNull();

    useStorageStatusStore.getState().setPartial({isLow: false});

    useStorageStatusStore.getState().setPartial({isLow: true});
    expect(await screen.findByTestId('MAP:low-storage-banner')).toBeTruthy();
  });
});
