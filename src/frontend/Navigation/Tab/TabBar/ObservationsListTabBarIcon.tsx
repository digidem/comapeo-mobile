import React, {FC} from 'react';
import {TabBarIconProps} from '../../../sharedTypes/navigation';
import {useTabNavigationStore} from '../../../hooks/useTabNavigationStore';
import ObservationListIcon from '../../../images/ObservationList.svg';
import {COMAPEO_BLUE, MEDIUM_GREY} from '../../../lib/styles';

export const ObservationsListBarIcon: FC<TabBarIconProps> = props => {
  const {currentTab} = useTabNavigationStore();

  return (
    <ObservationListIcon
      {...props}
      height={25}
      stroke={
        props.focused && currentTab !== 'Tracking' ? COMAPEO_BLUE : MEDIUM_GREY
      }
    />
  );
};
