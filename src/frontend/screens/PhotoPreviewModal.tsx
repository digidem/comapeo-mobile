import {NativeRootNavigationProps} from '../sharedTypes/navigation.ts';
import React, {FC, useEffect, useState} from 'react';
import {PhotoUnpreparedView} from '../sharedComponents/PhotoUnpreparedView.tsx';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {WHITE} from '../lib/styles.ts';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from '../sharedComponents/BottomSheetModal';
import {defineMessages, useIntl} from 'react-intl';
import {useDraftObservation} from '../hooks/useDraftObservation.ts';
import {PhotoPreparedView} from '../sharedComponents/PhotoPreparedView.tsx';
import ErrorIcon from '../images/Error.svg';

const m = defineMessages({
  headerDeleteButtonText: {
    id: 'screens.PhotoPreviewModal.DeletePhoto.headerButtonText',
    defaultMessage: 'Delete Photo',
  },
  deleteModalTitle: {
    id: 'screens.PhotoPreviewModal.DeletePhoto.deleteModalTitle',
    defaultMessage: 'Delete this photo?',
  },
  deleteModalDeleteButton: {
    id: 'screens.PhotoPreviewModal.DeletePhoto.deleteModalDeleteButton',
    defaultMessage: 'Delete Image',
  },
  deleteModalCancelButton: {
    id: 'screens.PhotoPreviewModal.DeletePhoto.cancelButton',
    defaultMessage: 'Cancel',
  },
});

export const PhotoPreviewModal: FC<
  NativeRootNavigationProps<'PhotoPreviewModal'>
> = ({route}) => {
  const {originalPhotoUri, observationId, deletable, attachmentId} =
    route.params;
  const navigation = useNavigationFromRoot();
  const [showHeader, setShowHeader] = useState(true);
  const draftObservation = useDraftObservation();
  const {sheetRef, isOpen, closeSheet, openSheet} = useBottomSheetModal({
    openOnMount: false,
  });
  const {formatMessage: t} = useIntl();

  const handlePhotoDelete = () => {
    if (originalPhotoUri) {
      draftObservation.deletePhoto(originalPhotoUri);
    }
    navigation.goBack();
    closeSheet();
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: showHeader,
      // eslint-disable-next-line react/no-unstable-nested-components -- it's correct syntax
      headerRight: () =>
        deletable ? (
          <TouchableOpacity
            onPress={openSheet}
            style={styles.deleteButtonWrapper}>
            <MaterialIcons name="delete" size={18} color={WHITE} />
            <Text style={styles.deleteButtonText}>
              {t(m.headerDeleteButtonText)}
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        ),
    });
  }, [deletable, navigation, openSheet, showHeader, t]);

  return (
    <>
      {observationId && attachmentId ? (
        <PhotoUnpreparedView
          onPress={() => setShowHeader(!showHeader)}
          observationId={observationId}
          attachmentId={attachmentId}
          variant={'original'}
        />
      ) : originalPhotoUri ? (
        <PhotoPreparedView
          onPress={() => setShowHeader(!showHeader)}
          photoUri={originalPhotoUri}
        />
      ) : (
        <></>
      )}

      <BottomSheetModal ref={sheetRef} isOpen={isOpen}>
        <BottomSheetContent
          title={t(m.deleteModalTitle)}
          buttonConfigs={[
            {
              text: t(m.deleteModalDeleteButton),
              dangerous: true,
              onPress: handlePhotoDelete,
              variation: 'filled',
              icon: <MaterialIcons name="delete" size={24} color={WHITE} />,
            },
            {
              text: t(m.deleteModalCancelButton),
              onPress: closeSheet,
              variation: 'outlined',
            },
          ]}
          icon={<ErrorIcon width={60} height={60} />}
        />
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  deleteButtonWrapper: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: WHITE,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  deleteButtonText: {
    marginLeft: 4,
    color: WHITE,
    fontSize: 13,
  },
});
