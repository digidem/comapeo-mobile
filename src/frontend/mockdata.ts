// @ts-check

import {FieldValue, Observation, Preset, PresetValue} from '@mapeo/schema';

export const mockObservations: Observation[] = [
  {
    schemaName: 'observation',
    refs: [
      {
        id: 'fC68D4fB881DaB23Ae6372b2Basd2fF3a2',
      },
      {
        id: '198Ac0C19ddAFaBbA72aba9d0D5A2b5D052',
      },
      {
        id: '7a39dcfe44FfC5871f7CasdE8F9aE2C46Cc',
      },
      {
        id: '30Bec1fbAc43f28e7EdaasdBdb9aCc8d0b6',
      },
      {
        id: 'EEC4BBeefb3ea80De05cAasd455ddbD2201',
      },
    ],
    attachments: [],
    tags: {
      categoryId: '9',
      notes: 'this is a test observation',
    },
    metadata: {},
    lat: -67.8898,
    lon: 98.04,
    links: [],
    docId: '1',
    createdAt: '1908-11-18T19:20:24.0Z',
    createdBy: '2DAa8CB21asdf8CA2002669fBCf7d2dB2Db9',
    updatedAt: '',
    versionId: '',
    deleted: false,
  },
  {
    schemaName: 'observation',
    refs: [
      {
        id: 'fC68D4fB881DaB23Ae6372b2B52fF3a2',
      },
      {
        id: '198Ac0C19ddAFaBbA729d0D5A2b5D052',
      },
      {
        id: '7a39dcfe44FfC5871f7CE8F9aE2C46Cc',
      },
      {
        id: '30Bec1fbAc43f28e7EdaBdb9aCc8d0b6',
      },
      {
        id: 'EEC4BBeefb3ea80De05cA455ddbD2201',
      },
    ],
    attachments: [],
    tags: {
      categoryId: '8',
      notes: 'Another Observation',
    },
    metadata: {},
    lat: 49.76,
    lon: 123.1,
    links: [],
    docId: '2',
    createdAt: '1908-11-18T19:20:24.0Z',
    createdBy: '2DAa8asCB218CA2002669fBCf7d2dB2Db9',
    updatedAt: '',
    versionId: '',
    deleted: false,
  },
  {
    schemaName: 'observation',
    refs: [
      {
        id: 'fC68D4afB881DaB23Ae6372b2B52fF3a2',
      },
      {
        id: '198Ac0asgC19ddAFaBbA729d0D5A2b5D052',
      },
      {
        id: '7a39dcfage44FfC5871f7CE8F9aE2C46Cc',
      },
      {
        id: '30Bec1fbeaeAc43f28e7EdaBdb9aCc8d0b6',
      },
      {
        id: 'EEC4BBeeegafb3ea80De05cA455ddbD2201',
      },
    ],
    attachments: [
      {
        driveDiscoveryId: 'fb3ea80De05cA455d',
        hash: '1fbeaeAc43f28e7EdaBdb9aCc8d0b6',
        name: 'Church',
        type: 'photo',
      },
    ],
    tags: {
      categoryId: '2',
      notes: 'Observation',
    },
    metadata: {},
    lat: -77.8898,
    lon: 98.0181,
    links: [],
    docId: '3',
    createdAt: '1899-01-17T03:34:04.0Z',
    createdBy: '2DAa8CB2a18CA2002669fBCf7d2dB2Db9',
    updatedAt: '',
    versionId: '',
    deleted: false,
  },
];

export const MockPreset: PresetValue[] = [
  {
    schemaName: 'preset',
    name: 'threat',
    addTags: {},
    geometry: ['point'],
    tags: {},
    removeTags: {},
    fieldIds: [],
    terms: [],
  },
  {
    schemaName: 'preset',
    name: 'fountain',
    addTags: {},
    geometry: ['point'],
    tags: {},
    removeTags: {},
    fieldIds: [],
    terms: [],
  },
  {
    schemaName: 'preset',
    name: 'lake',
    addTags: {},
    geometry: ['point'],
    tags: {},
    removeTags: {},
    fieldIds: [],
    terms: [],
  },
  {
    schemaName: 'preset',
    name: 'fishing spot',
    addTags: {},
    geometry: ['point'],
    tags: {},
    removeTags: {},
    fieldIds: [],
    terms: [],
  },
  {
    schemaName: 'preset',
    name: 'cultural site',
    addTags: {},
    geometry: ['point'],
    tags: {},
    removeTags: {},
    fieldIds: ['24'],
    terms: [],
  },
  {
    schemaName: 'preset',
    name: 'House',
    addTags: {},
    geometry: ['point'],
    tags: {},
    removeTags: {},
    fieldIds: ['21'],
    terms: [],
  },
  {
    schemaName: 'preset',
    name: 'Satanic Temple',
    addTags: {},
    geometry: ['point'],
    tags: {},
    removeTags: {},
    fieldIds: [],
    terms: [],
  },
  {
    schemaName: 'preset',
    name: 'Balcony',
    addTags: {},
    geometry: ['point'],
    tags: {},
    removeTags: {},
    fieldIds: ['21', '22'],
    terms: [],
  },
  {
    schemaName: 'preset',
    name: 'Basillica',
    addTags: {},
    geometry: ['point'],
    tags: {},
    removeTags: {},
    fieldIds: [],
    terms: [],
  },
];

export const mockFields: (FieldValue & {docId: string})[] = [
  {
    tagKey: '1',
    type: 'text',
    label: 'What is happening',
    appearance: 'singleline',
    snakeCase: false,
    placeholder: 'things happening',
    helperText: 'describe the situation',
    schemaName: 'field',
    docId: '21',
  },
  {
    tagKey: '2',
    type: 'text',
    label: 'Multiline - What is happening',
    appearance: 'multiline',
    snakeCase: false,
    placeholder: 'multiline placeholder',
    helperText: 'describe the situation for the multilin',
    schemaName: 'field',
    docId: '22',
  },
  {
    tagKey: '3',
    type: 'selectOne',
    label: 'singleSelect',
    options: [
      {label: 'first single select', value: 'first'},
      {label: 'second single select', value: 'second'},
      {label: 'third single select', value: 'third'},
    ],
    snakeCase: false,
    placeholder: 'you should not be able to see this',
    helperText: 'choose a singleselect',
    schemaName: 'field',
    docId: '23',
  },
  {
    tagKey: '4',
    type: 'selectMultiple',
    label: 'Multi Select',
    options: [
      {label: 'first multi select', value: 'first'},
      {label: 'second multi select', value: 'second'},
      {label: 'third multi select', value: 'third'},
    ],
    helperText: 'This is a multi-select',
    schemaName: 'field',
    docId: '24',
  },
];
