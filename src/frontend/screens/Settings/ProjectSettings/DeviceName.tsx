import * as React from 'react';
import {useForm, Controller} from 'react-hook-form';
import {Alert, Keyboard, StyleSheet, TextInput} from 'react-native';
import {NativeNavigationComponent} from '../../../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../../sharedComponents/Text';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {BLACK, MEDIUM_GREY, RED} from '../../../lib/styles';
import {
  useDeviceInfo,
  useEditDeviceInfo,
} from '../../../hooks/server/deviceInfo';
import {Loading} from '../../../sharedComponents/Loading';
import {HeaderRightDeviceName} from './HeaderRightDeviceName';

const m = defineMessages({
  title: {
    id: 'Screens.Settings.ProjectSettings.DeviceName.title',
    defaultMessage: 'Device Name',
  },
  yourDevice: {
    id: 'Screens.Settings.ProjectSettings.DeviceName.yourDevice',
    defaultMessage: 'Your Device Name',
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

export const DeviceName: NativeNavigationComponent<'DeviceName'> = ({
  navigation,
}) => {
  const [isEditting, setIsEditting] = React.useState(false);
  const deviceInfo = useDeviceInfo();
  const {mutate, isPending, variables: newDeviceName} = useEditDeviceInfo();
  const {formatMessage: t} = useIntl();
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<FormData>({defaultValues: {name: ''}});

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightDeviceName
          handleSubmit={handleSubmit(val => {
            mutate(val.name);
            setIsEditting(false);
          })}
          setIsEditting={setIsEditting}
          isEditting={isEditting}
        />
      ),
    });
  }, [navigation, isEditting, handleSubmit, setIsEditting]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (!isEditting) {
        // if user is not doing anything then don't intercept back action
        return;
      }

      // Prevent default behavior of leaving the screen
      e.preventDefault();

      if (watch().name.length < 1) {
        setIsEditting(false);
        return;
      }
      // Prompt the user before leaving the screen
      Alert.alert(t(m.discardChanges), undefined, [
        {text: t(m.continueEditting), style: 'cancel', onPress: () => {}},
        {
          text: t(m.discardChanges),
          onPress: () => navigation.dispatch(e.data.action),
        },
      ]);
    });

    return () => unsubscribe();
  }, [navigation, isEditting, watch]);

  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={() => Keyboard.dismiss()}>
      <Text style={{fontWeight: 'bold', marginBottom: 10}}>
        {t(!isEditting ? m.yourDevice : m.editDevice)}
      </Text>
      {!isEditting ? (
        deviceInfo.isLoading ? (
          <Loading />
        ) : (
          // Optimistically updates the device name
          <Text>{isPending ? newDeviceName : deviceInfo.data?.name}</Text>
        )
      ) : (
        <React.Fragment>
          <Controller
            name="name"
            control={control}
            rules={{required: true, maxLength: 60}}
            render={({field: {value, onChange, onBlur}}) => (
              <TextInput
                style={{
                  borderColor: errors.name ? RED : MEDIUM_GREY,
                  borderWidth: 1,
                  borderRadius: 5,
                  color: BLACK,
                  paddingStart: 10,
                }}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholderTextColor={MEDIUM_GREY}
                placeholder={deviceInfo.data?.name}
              />
            )}
          />
          <Text>{`${watch().name.length}/60`}</Text>
        </React.Fragment>
      )}
    </TouchableWithoutFeedback>
  );
};

DeviceName.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
});
