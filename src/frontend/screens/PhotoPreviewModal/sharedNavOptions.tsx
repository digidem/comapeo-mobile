import {WHITE, BLACK} from '../../lib/styles';

import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {MessageDescriptor, defineMessages} from 'react-intl';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft.tsx';

const m = defineMessages({
  navTitle: {
    id: 'screens.PhotoPreviewModal.navTitle',
    defaultMessage: 'Photo Info',
  },
});

export function sharedPhotoPreviewNavOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}): NativeStackNavigationOptions {
  return {
    headerTitle: intl(m.navTitle),
    headerTitleStyle: {color: WHITE},
    headerStyle: {backgroundColor: BLACK},
    contentStyle: {backgroundColor: BLACK},
    headerLeft: props => (
      <CustomHeaderLeft tintColor={WHITE} headerBackButtonProps={props} />
    ),
  };
}
