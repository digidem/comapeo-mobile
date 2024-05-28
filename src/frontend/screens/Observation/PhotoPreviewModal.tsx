import {NativeRootNavigationProps} from '../../sharedTypes/navigation.ts';
import React, {FC} from 'react';
import {PhotoUnpreparedView} from '../../sharedComponents/PhotoUnpreparedView.tsx';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {WHITE} from '../../lib/styles.ts';
import {StatusBar} from 'expo-status-bar';

export const PhotoPreviewModal: FC<
  NativeRootNavigationProps<'PhotoPreviewModal'>
> = ({route}) => {
  const {observationId, attachmentId} = route.params;
  const navigation = useNavigationFromRoot();
  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: '',
      headerTransparent: true,
      headerStyle: {backgroundColor: 'transparent'},
      // eslint-disable-next-line react/no-unstable-nested-components -- it's correct syntax
      headerLeft: () => (
        <MaterialIcons
          name={'west'}
          size={24}
          color={WHITE}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  });

  return (
    <>
      <StatusBar style="light" />
      <PhotoUnpreparedView
        observationId={observationId}
        attachmentId={attachmentId}
        variant={'original'}
      />
    </>
  );
};
