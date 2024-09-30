import * as React from 'react';
import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import {defineMessages} from 'react-intl';

const m = defineMessages({
  navTitle: {
    id: 'ProjectSettings.RemoteArchive.AddRemoteArchive.navTitle',
    defaultMessage: 'Add Remote Archive',
  },
});

export const AddRemoteArchive: NativeNavigationComponent<
  'AddRemoteArchive'
> = () => {
  return <></>;
};

AddRemoteArchive.navTitle = m.navTitle;
