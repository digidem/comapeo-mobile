import React from 'react';
import {useAttachmentUrlQueries} from '../../hooks/server/media';
import {StoredAudioRecording} from '../../sharedTypes';

export function useAudioProcessing(audioAttachments: StoredAudioRecording[]) {
  const audioQueries = useAttachmentUrlQueries(audioAttachments, 'original');

  const audioRecordings = React.useMemo(() => {
    if (audioQueries.every(query => query.isSuccess)) {
      return audioQueries
        .filter(query => query.data?.url)
        .map(query => ({
          uri: query.data!.url,
          createdAt: 0, // Placeholder
          duration: 0, // Placeholder
        }));
    }
    return [];
  }, [audioQueries]);

  return audioRecordings;
}
