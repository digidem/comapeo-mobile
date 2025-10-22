import {defineMessages} from 'react-intl';
import {NativeNavigationComponent} from '../sharedTypes/navigation';

const m = defineMessages({
  navTitle: {
    id: 'screens.CollaboratorInfo.navTitle',
    defaultMessage: 'Collaborator Info',
  },
});

export const CollaboratorInfo: NativeNavigationComponent<
  'CollaboratorInfo'
> = () => {
  return null;
};

CollaboratorInfo.navTitle = m.navTitle;
