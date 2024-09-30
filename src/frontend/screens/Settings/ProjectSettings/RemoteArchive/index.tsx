import * as React from 'react';
import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import {defineMessages} from 'react-intl';
import {Coordinator} from './Coordinator';

const m = defineMessages({
  navTitle: {
    id: 'ProjectSettings.RemoteArchive.navTitle',
    defaultMessage: 'Remote Archive',
  },
});
export const RemoteArchive: NativeNavigationComponent<'RemoteArchive'> = () => {
  return <Coordinator />;
};

RemoteArchive.navTitle = m.navTitle;
