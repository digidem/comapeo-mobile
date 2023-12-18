import * as React from 'react';
import {useForm} from 'react-hook-form';
import {Alert, BackHandler, Keyboard, StyleSheet} from 'react-native';
import {NativeNavigationComponent} from '../../../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../../sharedComponents/Text';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {BLACK, MEDIUM_GREY, RED} from '../../../lib/styles';
import {
  useDeviceInfo,
  useEditDeviceInfo,
} from '../../../hooks/server/deviceInfo';
import {HeaderRightSaveButton} from '../../../sharedComponents/HeaderRightSaveButton';
import {HookFormTextInput} from '../../../sharedComponents/HookFormTextInput';
import {useFocusEffect} from '@react-navigation/native';
import {CustomHeaderLeft} from '../../../sharedComponents/CustomHeaderLeft';

const m = defineMessages({
  title: {
    id: 'Screens.Settings.ProjectSettings.DeviceName.title',
    defaultMessage: 'Device Name',
  },
  editDevice: {
    id: 'Screens.Settings.ProjectSettings.DeviceName.editDevice',
    defaultMessage: 'Edit Device Name',
  },
  discardChanges: {
    id: 'Screens.Settings.ProjectSettings.DeviceName.discardChanges',
    defaultMessage: 'Discard Changes',
  },
  continueEditting: {
    id: 'Screens.Settings.ProjectSettings.DeviceName.continueEditting',
    defaultMessage: 'Continue Editting',
  },
});

type FormData = {
  name: string;
};

export const DeviceNameEdit: NativeNavigationComponent<'DeviceNameEdit'> = ({
  navigation,
}) => {
  const {mutate} = useEditDeviceInfo();
  const {formatMessage: t} = useIntl();
  const deviceInfo = useDeviceInfo();
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<FormData>({defaultValues: {name: ''}});

  const onBackPress = React.useCallback(() => {
    Alert.alert(t(m.discardChanges), undefined, [
      {text: t(m.continueEditting), style: 'cancel', onPress: () => {}},
      {
        text: t(m.discardChanges),
        onPress: () => navigation.goBack(),
      },
    ]);

    return true;
  }, [navigation]);

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: props => (
        <CustomHeaderLeft headerBackButtonProps={props} onPress={onBackPress} />
      ),
    });
  }, [onBackPress]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightSaveButton
          onPress={handleSubmit(val => {
            mutate(val.name);
            navigation.goBack();
          })}
        />
      ),
    });
  }, [navigation, handleSubmit, mutate]);

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [onBackPress]),
  );

  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={() => Keyboard.dismiss()}>
      <Text style={{fontWeight: 'bold', marginBottom: 10}}>
        {t(m.editDevice)}
      </Text>
      <React.Fragment>
        <HookFormTextInput
          name="name"
          control={control}
          rules={{required: true, maxLength: 60}}
          placeholderTextColor={MEDIUM_GREY}
          placeholder={deviceInfo.data?.name}
          style={{
            borderColor: errors.name ? RED : MEDIUM_GREY,
            borderWidth: 1,
            borderRadius: 5,
            color: BLACK,
            paddingStart: 10,
          }}
        />
        <Text style={{color: errors.name ? RED : MEDIUM_GREY}}>{`${
          watch().name.length
        }/60`}</Text>
      </React.Fragment>
    </TouchableWithoutFeedback>
  );
};

DeviceNameEdit.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
});
