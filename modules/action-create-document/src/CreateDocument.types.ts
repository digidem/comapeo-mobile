import type {StyleProp, ViewStyle} from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type CreateDocumentModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type CreateDocumentViewProps = {
  url: string;
  onLoad: (event: {nativeEvent: OnLoadEventPayload}) => void;
  style?: StyleProp<ViewStyle>;
};
