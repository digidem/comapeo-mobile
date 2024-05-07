import * as React from 'react';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';

export const ObservationListHeaderLeft = (props: {
  tintColor?: string;
  pressColor?: string;
  pressOpacity?: number;
  labelVisible?: boolean;
}) => {
  const {goBack} = useNavigationFromHomeTabs();

  return (
    <TouchableOpacity style={{marginLeft: 10}}>
      <CustomHeaderLeft
        onPress={() => goBack()}
        headerBackButtonProps={{
          canGoBack: true,
          tintColor: props?.tintColor,
        }}
      />
    </TouchableOpacity>
  );
};
