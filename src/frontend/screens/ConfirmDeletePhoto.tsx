import {type NativeStackNavigationOptions} from '@react-navigation/native-stack';
import * as Sentry from '@sentry/react-native';
import {defineMessages, useIntl} from 'react-intl';
import {View} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Error from '../images/Error.svg';
import {BottomSheetWrapper} from '../sharedComponents/BottomSheetWrapper';
import {DestructiveButton, SecondaryButton} from '../sharedComponents/Buttons';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {type NativeRootNavigationProps} from '../sharedTypes/navigation';
import {useDraftObservationActions} from '../contexts/DraftObservationContext';

const m = defineMessages({
  title: {
    id: 'screens.ConfirmDeletePhoto.title',
    defaultMessage: 'Delete this photo?',
  },
  deletePhoto: {
    id: 'screens.ConfirmDeletePhoto.deletePhoto',
    defaultMessage: 'Delete Photo',
  },
  cancel: {
    id: 'screens.ConfirmDeletePhoto.cancel',
    defaultMessage: 'Cancel',
  },
});

export function ConfirmDeletePhoto({
  navigation,
  route,
}: NativeRootNavigationProps<'ConfirmDeletePhoto'>) {
  const {onSuccess, photoId} = route.params;

  const {formatMessage: t} = useIntl();

  const {deleteUnsavedAttachment} = useDraftObservationActions();

  return (
    <BottomSheetWrapper>
      <View style={{alignItems: 'center', gap: 40}}>
        <View style={{alignItems: 'center', gap: 20}}>
          <Error />
          <HeaderText
            selectable
            variant="header2"
            style={{textAlign: 'center'}}>
            {t(m.title)}
          </HeaderText>
        </View>

        <View style={{gap: 20}}>
          <DestructiveButton
            fullSize
            testID="PHOTO.deletePhoto"
            text={t(m.deletePhoto)}
            renderIcon={({color, size}) => (
              <MaterialIcons name="delete" size={size} color={color} />
            )}
            onPress={() => {
              try {
                deleteUnsavedAttachment(photoId);
              } catch (reason) {
                Sentry.captureException(reason);
                navigation.navigate('ErrorBottomSheet');
                return;
              }

              navigation.goBack();
              onSuccess?.();
            }}
          />
          <SecondaryButton
            fullSize
            text={t(m.cancel)}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
      </View>
    </BottomSheetWrapper>
  );
}

export const navigationOptions: NativeStackNavigationOptions = {
  animation: 'none',
  contentStyle: {
    backgroundColor: 'transparent',
  },
  headerShown: false,
  presentation: 'transparentModal',
};
