import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@testing-library/react-native';

import type {MapeoManager} from '@comapeo/core';
import type {ComapeoCoreClientApi} from '@comapeo/ipc';

import {
  createManager,
  setUpIPC,
} from '../../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../../tests/integration/helpers/react';

jest.mock('@maplibre/maplibre-react-native', () => {
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

let mockFreeBytes: number | null = null;
let mockTotalBytes: number | null = 64 * 1024 * 1024 * 1024;

jest.mock('../../hooks/useStorageReadingQuery', () => {
  const LOW = 500 * 1024 * 1024;
  return {
    __esModule: true,
    LOW_THRESHOLD_BYTES: LOW,
    useStorageReadingQuery: () => ({
      data:
        mockFreeBytes == null || mockTotalBytes == null
          ? null
          : {freeBytes: mockFreeBytes, totalBytes: mockTotalBytes},
    }),
    isLowStorage: (free: number | null, threshold: number = LOW) =>
      (free ?? Infinity) <= threshold,
  };
});

jest.mock('../../hooks/server/presets', () => ({
  usePresetsQuery: () => ({data: []}),
}));

process.env.MAPBOX_ACCESS_TOKEN = 'test-token';

import {MapScreen} from '.';

const Stack = createNativeStackNavigator<{Map: undefined}>();

describe('MapScreen low-storage banner', () => {
  let manager: MapeoManager;
  let client: ComapeoCoreClientApi;
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

    mockTotalBytes = 64 * 1024 * 1024 * 1024;
    mockFreeBytes = null;
  });

  afterEach(async () => {
    for (const fn of onTeardown) await fn();
  });

  const renderMap = async ({
    isOnline = true,
  }: Readonly<{isOnline?: boolean}> = {}) => {
    const app = createAppProvidersWrapper({
      mapeoApi: client,
      isOnline,
    });
    onTeardown.push(app.teardown);

    const tree = await render(
      <NavigationContainer>
        <React.Suspense fallback={null}>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Map" component={MapScreen} />
          </Stack.Navigator>
        </React.Suspense>
      </NavigationContainer>,
      {wrapper: app.wrapper},
    );

    const safeUnmount = async () => {
      await tree.unmount();
      await new Promise(res => setTimeout(res, 0));
    };
    onTeardown.unshift(safeUnmount);

    return tree;
  };

  it('shows banner when isLow is true and not dismissed', async () => {
    mockFreeBytes = 100 * 1024 * 1024;
    await renderMap();
    expect(await screen.findByTestId('MAP:low-storage-banner')).toBeTruthy();
  });

  it('hides banner after dismiss tap (still low)', async () => {
    mockFreeBytes = 100 * 1024 * 1024;
    const user = userEvent.setup();
    await renderMap();

    const banner = await screen.findByTestId('MAP:low-storage-banner');
    const closeBtn = within(banner).getByRole('button');
    await user.press(closeBtn);

    await waitFor(() =>
      expect(screen.queryByTestId('MAP:low-storage-banner')).toBeNull(),
    );

    expect(screen.queryByTestId('MAP:low-storage-banner')).toBeNull();
  });

  it('resets dismissal when storage recovers, then shows again when low returns', async () => {
    mockFreeBytes = 100 * 1024 * 1024;
    const user = userEvent.setup();
    await renderMap();

    const banner = await screen.findByTestId('MAP:low-storage-banner');
    const closeBtn = within(banner).getByRole('button');
    await user.press(closeBtn);

    await waitFor(() =>
      expect(screen.queryByTestId('MAP:low-storage-banner')).toBeNull(),
    );

    mockFreeBytes = 600 * 1024 * 1024;
    await renderMap();
    expect(screen.queryByTestId('MAP:low-storage-banner')).toBeNull();

    mockFreeBytes = 100 * 1024 * 1024;
    await renderMap();
    expect(await screen.findByTestId('MAP:low-storage-banner')).toBeTruthy();
  });
});
