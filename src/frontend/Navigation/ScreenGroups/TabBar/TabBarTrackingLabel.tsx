import React, {FC} from 'react';
import {TabBarLabel} from './TabBarLabel';
import {useTracking} from '../../../hooks/tracks/useTracking';
import {TabBarLabelParams} from '../../types';

export const TrackingLabel: FC<TabBarLabelParams> = props => {
  const {isTracking} = useTracking();
  return !isTracking && <TabBarLabel {...props} tabName={'Tracking'} />;
};
