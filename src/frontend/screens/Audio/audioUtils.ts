import {useEffect, useState} from 'react';
import {useAttachmentUrlQueries} from '../../hooks/server/media';
import {getAudioDuration} from './getAudioDuration';
import {Observation} from '@comapeo/schema';
import {AudioRecording} from '../../sharedTypes';

export const useAudioRecordings = (observation: Observation | null) => {
  const [audioRecordings, setAudioRecordings] = useState<AudioRecording[]>([]);

  if (!observation || !observation.attachments) {
    return [];
  }

  const audioAttachments = observation.attachments.filter(
    att => att.type === 'audio',
  );

  const audioQueries = useAttachmentUrlQueries(audioAttachments, 'original');

  useEffect(() => {
    if (audioQueries.every(query => query.isSuccess)) {
      const fetchDurations = async () => {
        const transformedRecordings = await Promise.all(
          audioQueries.map(async query => {
            const attachment = query.data!;
            const duration = await getAudioDuration(attachment.url);

            return {
              uri: attachment.url,
              createdAt: new Date(observation.createdAt).getTime(),
              duration,
            } as AudioRecording;
          }),
        );

        setAudioRecordings(transformedRecordings);
      };

      fetchDurations();
    }
  }, [audioQueries, observation.createdAt]);

  return audioRecordings;
};
