import {defineMessages, useIntl} from 'react-intl';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import {PrimaryButton} from './Buttons';
import SettingsIcon from '../images/Settings.svg';

const m = defineMessages({
  allow: {
    id: 'sharedComponents.PermissionButtons.allow',
    defaultMessage: 'Allow',
  },
  openSettings: {
    id: 'sharedComponents.PermissionButtons.openSettings',
    defaultMessage: 'Open Settings',
  },
});

type Props = {
  onPress: () => void;
  testID?: string;
};

/** Shown while the OS will still present its own permission dialog. */
export const AllowPermissionButton = ({onPress, testID}: Props) => {
  const {formatMessage} = useIntl();

  return (
    <PrimaryButton
      fullSize
      testID={testID}
      text={formatMessage(m.allow)}
      onPress={onPress}
      renderIcon={({color, size}) => (
        <MaterialIcons name="check-circle-outline" color={color} size={size} />
      )}
    />
  );
};

/** Shown once OS won't allow permission to can change the answer. */
export const OpenSettingsButton = ({onPress, testID}: Props) => {
  const {formatMessage} = useIntl();

  return (
    <PrimaryButton
      fullSize
      testID={testID}
      text={formatMessage(m.openSettings)}
      onPress={onPress}
      renderIcon={({color, size}) => (
        <SettingsIcon color={color} width={size} height={size} />
      )}
    />
  );
};
