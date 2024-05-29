export interface AudioRecording {
  uri: string;
  createdAt: number;
  duration: number;
  attachmentId?: string;
  observationId?: string;
}
