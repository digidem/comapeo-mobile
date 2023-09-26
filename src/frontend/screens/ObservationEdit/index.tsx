import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import SaveButton from './SaveButton';
import {NativeNavigationScreen} from '../../sharedTypes';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {View, ScrollView, StyleSheet} from 'react-native';
import {LocationView} from './LocationView';
import {DescriptionField} from './DescriptionField';
import {BottomSheet} from './BottomSheet';
import {ThumbnailScrollView} from '../../sharedComponents/ThumbnailScrollView';
import {CustomHeaderLeftClose} from '../../sharedComponents/CustomHeaderLeftClose';
import {CategoryView} from './CategoryView';

const m = defineMessages({
  editTitle: {
    id: 'screens.ObservationEdit.editTitle',
    defaultMessage: 'Edit Observation',
    description: 'screen title for edit observation screen',
  },
  newTitle: {
    id: 'screens.ObservationEdit.newTitle',
    defaultMessage: 'New Observation',
    description: 'screen title for new observation screen',
  },
  photoButton: {
    id: 'screens.ObservationEdit.ObservationEditView.photoButton',
    defaultMessage: 'Add Photo',
    description: 'Button label for adding photo',
  },
});

export const ObservationEdit: NativeNavigationScreen<'ObservationEdit'> = ({
  navigation,
  route,
}) => {
  const observationId = route.params?.observationId;
  const isNew = route.params?.isNew;
  const photos = usePersistedDraftObservation(store => store.photos);
  const {formatMessage: t} = useIntl();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: observationId ? t(m.editTitle) : t(m.newTitle),
      headerLeft: props => (
        <CustomHeaderLeftClose
          headerBackButtonProps={props}
          observationId={observationId}
        />
      ),
      headerRight: () => <SaveButton observationId={observationId} />,
    });
  }, [navigation, observationId, CustomHeaderLeftClose, SaveButton]);

  const handleCategoryPress = React.useCallback(() => {
    navigation.navigate({
      key: 'fromObservationEdit',
      name: 'CategoryChooser',
    });
  }, [navigation]);

  const handleCameraPress = React.useCallback(() => {
    navigation.navigate('AddPhoto');
  }, [navigation]);

  const handleDetailsPress = React.useCallback(() => {
    navigation.navigate('ObservationDetails', {question: 1});
  }, [navigation]);

  const handlePhotoPress = React.useCallback(
    (photoIndex: number) => {
      // navigation.navigate('PhotosModal', {
      //   photoIndex: photoIndex,
      //   observationId: observationId,
      //   editing: true,
      // });
      return;
    },
    [navigation],
  );

  const bottomSheetItems = [
    {
      icon: <></>,
      label: t(m.photoButton),
      onPress: handleCameraPress,
    },
  ];
  // if (preset && preset.fields && preset.fields.length) {
  //   // Only show the option to add details if preset fields are defined.
  //   bottomSheetItems.push({
  //     icon: <DetailsIcon />,
  //     label: t(m.detailsButton),
  //     onPress: handleDetailsPress,
  //   });
  // }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}>
        {isNew && <LocationView />}

        <CategoryView onPress={handleCategoryPress} />
        <DescriptionField />
        <ThumbnailScrollView onPressPhoto={handlePhotoPress} photos={photos} />
      </ScrollView>
      <BottomSheet items={bottomSheetItems} />
    </View>
  );
};

ObservationEdit.navTitle = m.newTitle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'stretch',
  },
  scrollViewContent: {
    flexDirection: 'column',
    alignContent: 'stretch',
  },
});
