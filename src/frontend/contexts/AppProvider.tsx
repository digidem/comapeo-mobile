import * as React from 'react';
import {PermissionsProvider} from './PermissionsContext';
import {ObservationProvider} from './ObservationsContext';
import {PhotoPromiseProvider} from './PhotoPromiseContext';
import {LocationProvider} from './LocationContext';
import {SecurityProvider} from './SecurityContext';

/**
 *
 * This holds all the custom providers - aka created by a developer and not from a library (except the intl provider which needs to be at the top level)
 */
export const AppProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <PermissionsProvider>
      <ObservationProvider>
        <PhotoPromiseProvider>
          <LocationProvider>
            <SecurityProvider>{children}</SecurityProvider>
          </LocationProvider>
        </PhotoPromiseProvider>
      </ObservationProvider>
    </PermissionsProvider>
  );
};
