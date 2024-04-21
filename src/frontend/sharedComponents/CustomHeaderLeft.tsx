import {HeaderBackButton} from '@react-navigation/elements';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';

import {BackIcon} from './icons';
import {BLACK} from '../lib/styles';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';

// We use a slightly larger back icon, to improve accessibility
// TODO iOS: This should probably be a chevron not an arrow
export const HeaderBackIcon = ({tintColor}: {tintColor: string}) => {
  return <BackIcon color={tintColor} />;
};

interface CustomHeaderLeftProps {
  tintColor?: string;
  headerBackButtonProps: HeaderBackButtonProps;
  onPress?: () => void;
}

export const CustomHeaderLeft = ({
  tintColor,
  headerBackButtonProps,
  onPress,
}: CustomHeaderLeftProps) => {
  const navigation = useNavigationFromRoot();
  return (
    <HeaderBackButton
      {...headerBackButtonProps}
      onPress={onPress || (() => navigation.goBack())}
      style={{marginLeft: 0, marginRight: 15}}
      backImage={() => <HeaderBackIcon tintColor={tintColor || BLACK} />}
    />
  );
};
