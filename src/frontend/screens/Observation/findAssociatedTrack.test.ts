import {Track} from '@comapeo/schema';
import {findAssociatedTrack} from './findAssociatedTrack';

const tracks: Track[] = [
  {
    docId: 'abc123',
    versionId: '1234567890abcdef1234567890abcdef/1',
    originalVersionId: '1234567890abcdef1234567890abcdef/1',
    schemaName: 'track',
    createdAt: '2024-12-01T08:00:00Z',
    updatedAt: '2024-12-02T08:00:00Z',
    links: ['1234567890abcdef1234567890abcdef/0'],
    deleted: false,
    locations: [
      {
        timestamp: '2024-12-09T12:00:00Z',
        mocked: false,
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      },
    ],
    observationRefs: [
      {
        docId: 'def456',
        versionId: 'abcdef1234567890abcdef1234567890/2',
      },
    ],
    tags: {
      terrain: 'urban',
      difficulty: 3,
    },
  },
  {
    docId: 'def456',
    versionId: 'abcdef1234567890abcdef1234567890/2',
    originalVersionId: 'abcdef1234567890abcdef1234567890/1',
    schemaName: 'track',
    createdAt: '2024-11-30T09:00:00Z',
    updatedAt: '2024-12-01T10:30:00Z',
    links: ['abcdef1234567890abcdef1234567890/1'],
    deleted: false,
    locations: [
      {
        timestamp: '2024-12-08T10:30:00Z',
        mocked: true,
        coords: {
          latitude: 34.0522,
          longitude: -118.2437,
          altitude: 305,
        },
      },
    ],
    observationRefs: [
      {
        docId: 'ghi789',
        versionId: '7890abcdef1234567890abcdef123456/3',
      },
    ],
    tags: {
      environment: 'forest',
      notes: 'First hike in the area',
    },
  },
  {
    docId: 'ghi789',
    versionId: '7890abcdef1234567890abcdef123456/3',
    originalVersionId: '7890abcdef1234567890abcdef123456/3',
    schemaName: 'track',
    createdAt: '2024-11-29T12:00:00Z',
    updatedAt: '2024-12-07T15:45:00Z',
    links: [],
    deleted: false,
    locations: [
      {
        timestamp: '2024-12-07T15:45:00Z',
        mocked: false,
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
          speed: 5.5,
          accuracy: 10,
        },
      },
    ],
    observationRefs: [
      {
        docId: 'jkl012',
        versionId: 'abcdefabcdefabcdefabcdefabcdef12/4',
      },
    ],
    tags: {
      temperature: 22,
      visibility: null,
    },
  },
  {
    docId: 'jkl012',
    versionId: 'abcdefabcdefabcdefabcdefabcdef12/4',
    originalVersionId: 'abcdefabcdefabcdefabcdefabcdef12/1',
    schemaName: 'track',
    createdAt: '2024-11-28T14:00:00Z',
    updatedAt: '2024-12-06T09:15:00Z',
    links: ['abcdefabcdefabcdefabcdefabcdef12/1'],
    deleted: false,
    locations: [
      {
        timestamp: '2024-12-06T09:15:00Z',
        mocked: false,
        coords: {
          latitude: 48.8566,
          longitude: 2.3522,
          heading: 90,
        },
      },
    ],
    observationRefs: [],
    tags: {},
  },
  {
    docId: 'mno345',
    versionId: 'abcdefabcdefabcdefabcdefabcdef34/5',
    originalVersionId: 'abcdefabcdefabcdefabcdefabcdef34/5',
    schemaName: 'track',
    createdAt: '2024-11-27T16:00:00Z',
    updatedAt: '2024-12-05T18:20:00Z',
    links: [],
    deleted: false,
    locations: [
      {
        timestamp: '2024-12-05T18:20:00Z',
        mocked: true,
        coords: {
          latitude: -33.8688,
          longitude: 151.2093,
          altitude: 58,
          speed: 2.3,
        },
      },
    ],
    observationRefs: [],
    tags: {
      highlights: ['beach', 'sunset'],
    },
  },
];

describe('Tests findAssociatedTrack', () => {
  it('returns undefined when tracks prop is undefined', () => {
    const track = findAssociatedTrack({tracks: undefined, observationId: '1'});
    expect(track).toBeUndefined();
  });

  it('returns the correct track with the associated observationId', () => {
    const track = findAssociatedTrack({tracks, observationId: 'ghi789'});
    expect(track?.docId).toBe('def456');
  });

  it('returns undefined when there is no matching observation docId', () => {
    const track = findAssociatedTrack({tracks, observationId: 'qwerty'});
    expect(track).toBeUndefined();
  });
});
