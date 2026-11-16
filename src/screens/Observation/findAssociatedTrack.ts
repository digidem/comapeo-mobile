import {type Track} from '@comapeo/schema';

export function findAssociatedTrack<T extends Track = Track>({
  tracks,
  observationId,
}: {
  tracks: T[];
  observationId: string;
}): T | undefined {
  return tracks.find(trackData =>
    trackData.observationRefs.some(ref => ref.docId === observationId),
  );
}
