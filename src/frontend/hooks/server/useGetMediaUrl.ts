import {Observation} from '@mapeo/schema';
import {PhotoVariant} from '../../sharedTypes';
import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';

type MediaOptions = {
  variant: PhotoVariant;
  attachment: Observation['attachments'][0];
};

export const useGetMediaUrl = (mediaOptions: MediaOptions) => {
  const [url, setUrl] = useState<string>();
  // This should come from persisted state
  const projectId = '12';
  const {attachment} = mediaOptions;

  const query = useQuery({
    // setting staleTime and CacheTime to infinity means it will only call the api once (aka photos do not get editted so we do not need to keep getting from the server)
    staleTime: Infinity,
    cacheTime: Infinity,
    queryKey: [
      `${projectId}/${attachment.driveDiscoveryId}/${attachment.type}/${attachment.name}`,
    ],
    queryFn: async () => await mockedMediaApi({...mediaOptions, projectId}),
  });

  return query;
};
// @ts-ignore
async function mockedMediaApi({
  projectId: string,
  ...mediaOptions
}: MediaOptions & {projectId: string}): Promise<string> {
  return require('../../images/observation-icon.png');
}
