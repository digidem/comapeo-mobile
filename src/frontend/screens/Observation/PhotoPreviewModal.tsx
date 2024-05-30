import {NativeRootNavigationProps} from '../../sharedTypes/navigation.ts';
import React, {FC} from 'react';
import {PhotoUnpreparedView} from '../../sharedComponents/PhotoUnpreparedView.tsx';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';

export const PhotoPreviewModal: FC<
  NativeRootNavigationProps<'PhotoPreviewModal'>
> = ({route}) => {
  const {observationId, attachmentId} = route.params;
  const navigation = useNavigationFromRoot();
  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: true,
    });
  });

  return (
    <PhotoUnpreparedView
      observationId={observationId}
      attachmentId={attachmentId}
      variant={'original'}
    />
  );
};
