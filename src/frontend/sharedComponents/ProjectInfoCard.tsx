import * as React from 'react';
import {View} from 'react-native';

type ProjectInfoCardProps = {color: string; description?: string} & (
  | {
      projectName: string;

      role: 'coordinator' | 'participant';
    }
  | {
      header: string;
      role: 'solo';
    }
);

export const ProjectInfoCard = () => {
  return <View />;
};
