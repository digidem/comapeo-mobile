import {getAttachmentPhotoInfo, getDraftPhotoInfo} from './photos';

test('getAttachmentPhoto()', () => {
  const baseAttachmentFields = {
    type: 'photo' as const,
    driveDiscoveryId: 'some_drive_id',
    hash: 'some_hash',
    name: 'some_name',
  };

  const now = Date.now();

  /**
   * timestamp available
   */
  expect(
    getAttachmentPhotoInfo({
      ...baseAttachmentFields,
      external: false,
      createdAt: new Date(now).toISOString(),
    }),
  ).toStrictEqual({
    external: false,
    createdAt: now,
    coordinates: undefined,
  });

  /**
   * `external` field
   */
  expect(
    getAttachmentPhotoInfo({
      ...baseAttachmentFields,
      external: true,
    }),
  ).toStrictEqual({
    external: true,
    createdAt: undefined,
    coordinates: undefined,
  });

  expect(
    getAttachmentPhotoInfo({
      ...baseAttachmentFields,
      external: false,
    }),
  ).toStrictEqual({
    external: false,
    createdAt: undefined,
    coordinates: undefined,
  });

  /**
   * location info available
   */
  expect(
    getAttachmentPhotoInfo({
      ...baseAttachmentFields,
      external: false,
      position: {
        timestamp: new Date().toISOString(),
        mocked: false,
        coords: {
          altitudeAccuracy: 2,
          accuracy: 3,
          altitude: 10,
          heading: 5,
          speed: 10,
          latitude: 10,
          longitude: -10,
        },
      },
    }),
  ).toStrictEqual({
    external: false,
    createdAt: undefined,
    coordinates: {
      latitude: 10,
      longitude: -10,
    },
  });

  /**
   * EXIF info available
   */
  // Horizontal photo
  expect(
    getAttachmentPhotoInfo({
      ...baseAttachmentFields,
      external: false,
      photoExif: {
        Make: 'Google',
        Model: 'Pixel 2',
        FNumber: 1.85,
        Orientation: 1,
        ImageLength: 100,
        ImageWidth: 200,
      },
    }),
  ).toStrictEqual({
    external: false,
    createdAt: undefined,
    coordinates: undefined,
    width: 200,
    height: 100,
    fNumber: 1.85,
    layout: 'horizontal',
    make: 'Google',
    model: 'Pixel 2',
  });

  // Vertical photo
  expect(
    getAttachmentPhotoInfo({
      ...baseAttachmentFields,
      external: false,
      photoExif: {
        Make: 'Samsung',
        Model: 'Galaxy S25',
        FNumber: 2.5,
        Orientation: 8,
        ImageLength: 200,
        ImageWidth: 100,
      },
    }),
  ).toStrictEqual({
    external: false,
    createdAt: undefined,
    coordinates: undefined,
    width: 100,
    height: 200,
    fNumber: 2.5,
    layout: 'vertical',
    make: 'Samsung',
    model: 'Galaxy S25',
  });
});

test('getDraftPhotoInfo()', () => {
  const baseDraftPhotoFields = {
    type: 'processed' as const,
    draftPhotoId: 'some_photo_id',
    originalUri: 'file:///original/foo.jpg',
    previewUri: 'file:///preview/foo.jpg',
    thumbnailUri: 'file:///thumbnail/foo.jpg',
  };

  const now = Date.now();

  /**
   * timestamp available
   */
  expect(
    getDraftPhotoInfo({
      ...baseDraftPhotoFields,
      mediaMetadata: {
        timestamp: now,
      },
    }),
  ).toStrictEqual({
    createdAt: now,
    coordinates: undefined,
    external: false,
  });

  /**
   * location info available
   */
  expect(
    getDraftPhotoInfo({
      ...baseDraftPhotoFields,
      mediaMetadata: {
        timestamp: now,
        location: {
          timestamp: now + 1000,
          mocked: false,
          coords: {
            altitudeAccuracy: 2,
            accuracy: 3,
            altitude: 10,
            heading: 5,
            speed: 10,
            latitude: 10,
            longitude: -10,
          },
        },
      },
    }),
  ).toStrictEqual({
    createdAt: now,
    external: false,
    coordinates: {latitude: 10, longitude: -10},
  });

  /**
   * EXIF info available
   */
  // Horizontal photo
  expect(
    getDraftPhotoInfo({
      ...baseDraftPhotoFields,
      mediaMetadata: {
        timestamp: now,
        photoExif: {
          Make: 'Google',
          Model: 'Pixel 2',
          FNumber: 1.85,
          Orientation: 1,
          ImageLength: 100,
          ImageWidth: 200,
        },
      },
    }),
  ).toStrictEqual({
    external: false,
    createdAt: now,
    coordinates: undefined,
    width: 200,
    height: 100,
    fNumber: 1.85,
    layout: 'horizontal',
    make: 'Google',
    model: 'Pixel 2',
  });

  // Vertical photo
  expect(
    getDraftPhotoInfo({
      ...baseDraftPhotoFields,
      mediaMetadata: {
        timestamp: now,
        photoExif: {
          Make: 'Samsung',
          Model: 'Galaxy S25',
          FNumber: 2.5,
          Orientation: 8,
          ImageLength: 200,
          ImageWidth: 100,
        },
      },
    }),
  ).toStrictEqual({
    createdAt: now,
    external: false,
    coordinates: undefined,
    width: 100,
    height: 200,
    fNumber: 2.5,
    layout: 'vertical',
    make: 'Samsung',
    model: 'Galaxy S25',
  });
});
