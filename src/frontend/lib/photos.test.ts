import {getAttachmentPhotoInfo, getDraftPhotoInfo} from './photos';

test('getAttachmentPhoto()', () => {
  const baseFields = {
    type: 'photo' as const,
    driveDiscoveryId: 'some_drive_id',
    hash: 'some_hash',
    name: 'some_name',
  };

  const now = Date.now();

  expect(getAttachmentPhotoInfo(baseFields)).toStrictEqual({
    external: false,
    coordinates: undefined,
    createdAt: undefined,
  });

  /**
   * timestamp available
   */
  expect(
    getAttachmentPhotoInfo({
      ...baseFields,
      // @ts-expect-error Updated core needed
      createdAt: new Date(now).toISOString(),
    }),
  ).toStrictEqual({
    external: false,
    createdAt: now,
    coordinates: undefined,
  });

  /**
   * `external` field available
   */
  expect(
    getAttachmentPhotoInfo({
      ...baseFields,
      // @ts-expect-error Updated core needed
      external: true,
    }),
  ).toStrictEqual({
    external: true,
    createdAt: undefined,
    coordinates: undefined,
  });

  expect(
    getAttachmentPhotoInfo({
      ...baseFields,
      // @ts-expect-error Updated core needed
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
      ...baseFields,
      // @ts-expect-error Updated core needed
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
      ...baseFields,
      photoExif: {
        Make: 'Google',
        Model: 'Pixel 2',
        // @ts-expect-error Updated core needed
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
      ...baseFields,
      photoExif: {
        Make: 'Samsung',
        Model: 'Galaxy S25',
        // @ts-expect-error Updated core needed
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
  const baseFields = {
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
      ...baseFields,
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
      ...baseFields,
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
      ...baseFields,
      mediaMetadata: {
        photoExif: {
          Make: 'Google',
          Model: 'Pixel 2',
          // @ts-expect-error Updated core needed
          FNumber: 1.85,
          Orientation: 1,
          ImageLength: 100,
          ImageWidth: 200,
        },
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
    getDraftPhotoInfo({
      ...baseFields,
      mediaMetadata: {
        timestamp: now,
        photoExif: {
          Make: 'Samsung',
          Model: 'Galaxy S25',
          // @ts-expect-error Updated core needed
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
