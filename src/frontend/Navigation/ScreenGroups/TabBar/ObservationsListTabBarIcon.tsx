import React, {FC} from 'react';
import {TabBarIconProps} from '../../types';
import {useTabNavigationStore} from '../../../hooks/useTabNavigationStore.ts';
import ObservationListIcon from '../../../images/ObservationList.svg';
import {COMAPEO_BLUE, MEDIUM_GREY} from '../../../lib/styles.ts';

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
