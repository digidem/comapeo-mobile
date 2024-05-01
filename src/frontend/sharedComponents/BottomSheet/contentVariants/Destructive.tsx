import React from 'react';

import {Content} from '../Content';
import DiscardIcon from '../../../images/delete.svg';
import ErrorIcon from '../../../images/Error.svg';

interface Props {
  title: string;
  description: string;
  destructiveButtonText: string;
  onDestructivePress: () => void;
  cancelButtonText: string;
  onCancel: () => void;
}

export const Destructive = ({
  title,
  description,
  destructiveButtonText,
  onDestructivePress,
  cancelButtonText,
  onCancel,
}: Props) => {
  return (
    <Content
      title={title}
      description={description}
      buttonConfigs={[
        {
          variation: 'filled',
          dangerous: true,
          onPress: onDestructivePress,
          text: destructiveButtonText,
          icon: <DiscardIcon />,
        },
        {
          onPress: onCancel,
          text: cancelButtonText,
          variation: 'outlined',
        },
      ]}
      icon={<ErrorIcon width={60} height={60} style={{marginBottom: 15}} />}
    />
  );
};
