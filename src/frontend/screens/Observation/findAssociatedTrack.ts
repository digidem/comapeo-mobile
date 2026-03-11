import {type Track} from '@comapeo/schema';

export function findAssociatedTrack<T extends Track>({
  tracks,
  observationId,
}: {
  tracks: T[];
  observationId: string;
}) {
  return tracks.find(trackData =>
    trackData.observationRefs.some(ref => ref.docId === observationId),
  );
}
