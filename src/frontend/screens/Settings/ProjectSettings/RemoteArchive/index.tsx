import * as React from 'react';
import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import {defineMessages} from 'react-intl';
import {Particpant} from './Particpant';

const m = defineMessages({
  navTitle: {
    id: 'ProjectSettings.RemoteArchive.navTitle',
    defaultMessage: 'Remote Archive',
  },
});

export const RemoteArchive: NativeNavigationComponent<'RemoteArchive'> = () => {
  return <Particpant />;
};

RemoteArchive.navTitle = m.navTitle;
