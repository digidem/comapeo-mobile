import React from 'react';
import PlayArrow from '../../images/PlayArrow.svg';
import {ThumbnailContainer} from './ThumbnailContainer';
import {AudioAttachment} from '../../sharedTypes/audio';

import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {ActivityIndicator} from 'react-native';

type AudioThumbnailProps = {
  audio: AudioAttachment;
  observationId: string;
  size: number;
};

export const AudioSavedThumbnail = ({
  audio,
  observationId,
  size,
}: AudioThumbnailProps) => {
  const {navigate} = useNavigationFromRoot();
  const [loading, setLoading] = React.useState(false);
  const {projectApi} = useActiveProject();

  const handlePress = async () => {
    if (loading) return;
    setLoading(true);
    // We dont want to use react query/core-react because we do not want to load the audio UNTIL the user wants to play it. this avoids having many audio files in memory
    projectApi.$blobs
      .getUrl({
        driveId: audio.driveDiscoveryId,
        name: audio.name,
        type: audio.type,
        variant: 'original',
      })
      .then(uri => {
        navigate('AudioPlaybackSaved', {
          uri,
          canDelete: false,
          observationId,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ThumbnailContainer size={size} onPress={handlePress}>
      {loading ? <ActivityIndicator /> : <PlayArrow width={48} height={48} />}
    </ThumbnailContainer>
  );
};
