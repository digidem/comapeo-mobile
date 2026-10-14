import * as React from 'react';
import {HeaderLeftClose} from '../../sharedComponents/HeaderLeftClose';
import {HeaderBackButtonProps} from '@react-navigation/elements';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useReplaceBackNavigation} from '../../hooks/useReplaceBackNavigation';

type HeaderLeftProps = {
  headerBackButtonProps: HeaderBackButtonProps;
};

export const HeaderLeft = ({headerBackButtonProps}: HeaderLeftProps) => {
  const navigation = useNavigationFromRoot();

  const handlePress = React.useCallback(() => {
    navigation.navigate('ConfirmDiscardObservationEditBottomSheet');
  }, [navigation]);

  useReplaceBackNavigation(handlePress);

  return (
    <HeaderLeftClose
      onPress={handlePress}
      headerBackButtonProps={headerBackButtonProps}
    />
  );
};
