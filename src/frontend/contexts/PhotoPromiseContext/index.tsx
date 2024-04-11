import * as React from 'react';
import {
  CancellablePhotoPromise,
  CapturedPictureMM,
  DraftPhoto,
  PREVIEW_QUALITY,
  PREVIEW_SIZE,
  Signal,
  THUMBNAIL_QUALITY,
  THUMBNAIL_SIZE,
} from './types';
import ImageResizer from '@bam.tech/react-native-image-resizer';

type PhotoPromiseContextState = {
  addPhotoPromise: (
    photo: Promise<CapturedPictureMM>,
    draftPhotoId: string,
  ) => CancellablePhotoPromise;
  cancelPhotoProcessing: () => void;
  deletePhotoPromise: (uri: string) => void;
};

const PhotoPromiseContext =
  React.createContext<PhotoPromiseContextState | null>(null);

export const usePhotoPromiseContext = () => {
  const context = React.useContext(PhotoPromiseContext);
  if (!context) {
    throw new Error('Photo Promise context not initialized');
  }
  return context;
};

export const PhotoPromiseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [photoPromises, setPhotoPromises] = React.useState<
    CancellablePhotoPromise[]
  >([]);

  const addPhotoPromise = React.useCallback(
    (photo: Promise<CapturedPictureMM>, draftPhotoId: string) => {
      // Use signal to cancel processing by setting signal.didCancel = true
      // Important because image resize/rotate is expensive
      const signal: Signal = {};

      const photoPromise: CancellablePhotoPromise = processPhoto(
        photo,
        draftPhotoId,
        signal,
      );

      photoPromise.signal = signal;

      setPhotoPromises(photos => [...photos, photoPromise]);

      return photoPromise;
    },
    [],
  );

  const cancelPhotoProcessing = React.useCallback(() => {
    photoPromises.forEach(p => p.signal && (p.signal.didCancel = true));
    setPhotoPromises([]);
  }, [photoPromises]);

  const deletePhotoPromise = React.useCallback((uri: String) => {
    const newPhotoPromiseArray = photoPromises.map(async photo => {
      const resolvedPhoto = await photo;
      if (resolvedPhoto.originalUri === uri) {
        const deletedPhoto: Promise<DraftPhoto> = new Promise(res => {
          resolvedPhoto.deleted = true;
          res(resolvedPhoto);
        });
        const cancelPhoto = deletedPhoto as CancellablePhotoPromise;
        cancelPhoto.signal = {didCancel: true};
        return cancelPhoto;
      }

      return photo;
    });

    setPhotoPromises(newPhotoPromiseArray);
  }, []);

  const context: PhotoPromiseContextState = React.useMemo(
    () => ({
      addPhotoPromise,
      cancelPhotoProcessing,
      deletePhotoPromise,
    }),
    [addPhotoPromise, cancelPhotoProcessing, deletePhotoPromise],
  );

  return (
    <PhotoPromiseContext.Provider value={context}>
      {children}
    </PhotoPromiseContext.Provider>
  );
};

async function processPhoto(
  photo: Promise<CapturedPictureMM>,
  draftPhotoId: string,
  {didCancel = false}: Signal,
): Promise<DraftPhoto> {
  const {uri: originalUri, rotate} = await photo;

  if (didCancel) throw new Error('Cancelled');

  // rotate will be defined if the original photo failed to rotate (this
  // happens on low-memory devices) so we rotate the preview and
  // thumbnail (rotating the smaller images seems to work ok).
  const {uri: thumbnailUri} = await ImageResizer.createResizedImage(
    originalUri,
    THUMBNAIL_SIZE,
    THUMBNAIL_SIZE,
    'JPEG',
    THUMBNAIL_QUALITY,
    rotate,
  );

  if (didCancel) throw new Error('Cancelled');

  const {uri: previewUri} = await ImageResizer.createResizedImage(
    originalUri,
    PREVIEW_SIZE,
    PREVIEW_SIZE,
    'JPEG',
    PREVIEW_QUALITY,
    rotate,
  );

  if (didCancel) throw new Error('Cancelled');

  return {
    draftPhotoId,
    originalUri,
    previewUri,
    thumbnailUri,
    capturing: false,
  };
}
