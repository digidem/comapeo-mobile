import * as React from 'react';
import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import {defineMessages} from 'react-intl';

const m = defineMessages({
  navTitle: {
    id: 'ProjectSettings.RemoteArchive.navTitle',
    defaultMessage: 'Remote Archive',
  },
});
export const RemoteArchive: NativeNavigationComponent<'RemoteArchive'> = () => {
  return <></>;
};

RemoteArchive.navTitle = m.navTitle;
