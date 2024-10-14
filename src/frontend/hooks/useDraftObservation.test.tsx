// TODO: Move this into a jest setup file
jest.mock('expo-localization', () => ({
  getLocales: (): Locale[] => [
    {
      languageTag: 'en-US',
      languageCode: null,
      regionCode: null,
      currencyCode: null,
      currencySymbol: null,
      decimalSeparator: null,
      digitGroupingSeparator: null,
      textDirection: null,
      measurementSystem: null,
      temperatureUnit: null,
    },
  ],
}));

import React from 'react';
import {act, renderHook} from '@testing-library/react-native';
import {PhotoPromiseProvider} from '../contexts/PhotoPromiseContext/index.tsx';
import {useDraftObservation} from './useDraftObservation.ts';
import {usePersistedDraftObservation} from './persistedState/usePersistedDraftObservation/index.ts';
import type {Locale} from 'expo-localization';
import type {Preset} from '@comapeo/schema';
import {randomBytes} from 'crypto';

test('Updating the preset on a draft observation does not loose user-entered details', () => {
  function Wrapper({children}: {children: React.ReactNode}) {
    return <PhotoPromiseProvider>{children}</PhotoPromiseProvider>;
  }

  const {result} = renderHook(
    () => ({
      ...useDraftObservation(),
      ...usePersistedDraftObservation(),
    }),
    {wrapper: Wrapper},
  );

  // Draft value should be null initially
  expect(result.current.value).toBeNull();
  act(() => {
    result.current.newDraft();
  });
  expect(result.current.value).toStrictEqual({
    lat: 0,
    lon: 0,
    metadata: {manualLocation: false},
    tags: {notes: ''},
    attachments: [],
  });

  const preset1: Preset = {
    ...createEmptyPreset(),
    name: 'Preset 1',
    tags: {
      tag1: 'value1',
    },
    addTags: {
      tag2: 'value2',
    },
  };

  const preset1ExpectedTags = {
    ...preset1.tags,
    ...preset1.addTags,
    notes: '',
  };

  act(() => {
    result.current.updatePreset(preset1);
  });

  expect(result.current.preset).toStrictEqual(preset1);
  expect(result.current.value?.tags).toStrictEqual(preset1ExpectedTags);

  const obsDetails = {
    detail1: 'value1',
    detail2: 'value2',
  };

  act(() => {
    for (const [key, value] of Object.entries(obsDetails)) {
      result.current.updateTags(key, value);
    }
    result.current.updateTags('notes', 'Some notes');
  });

  expect(result.current.value?.tags).toStrictEqual({
    ...preset1ExpectedTags,
    ...obsDetails,
    notes: 'Some notes',
  });

  // TODO: Better mock to also test removeTags behavior
  const preset2: Preset = {
    ...createEmptyPreset(),
    name: 'Preset 2',
    tags: {
      tag2: 'value4',
      tag3: 'value3',
    },
  };

  act(() => {
    result.current.updatePreset(preset2);
  });

  expect(result.current.preset).toStrictEqual(preset2);
  expect(result.current.value?.tags).toStrictEqual({
    ...preset2.tags,
    ...preset2.addTags,
    notes: 'Some notes',
    detail1: 'value1',
    detail2: 'value2',
  });
});

function createEmptyPreset(): Preset {
  const versionId = randomBytes(16).toString('hex') + '/0';
  return {
    schemaName: 'preset',
    tags: {},
    addTags: {},
    removeTags: {},
    geometry: ['point'],
    docId: randomBytes(16).toString('hex'),
    name: '',
    fieldRefs: [],
    terms: [],
    versionId,
    originalVersionId: versionId,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    links: [],
    deleted: false,
  };
}
