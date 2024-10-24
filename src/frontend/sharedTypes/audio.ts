import {Attachment} from './index';
import {LocationObject} from 'expo-location';

export type AudioAttachment = Omit<Attachment, 'type'> & {
  type: 'audio';
  deleted?: boolean;
};

export type UnsavedAudio = {
  uri: string;
  duration: number;
  createdAt: number;
};

export type Audio = AudioAttachment | UnsavedAudio;

export type MediaMetadata = {
  location?: LocationObject;
  duration: number;
  timestamp: number;
};
