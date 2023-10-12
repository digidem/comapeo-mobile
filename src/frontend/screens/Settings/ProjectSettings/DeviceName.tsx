import * as React from 'react';
import {Alert, Keyboard, StyleSheet, TextInput} from 'react-native';
import {NativeNavigationComponent} from '../../../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';
import {IconButton} from '../../../sharedComponents/IconButton';
import {EditIcon, SaveIcon} from '../../../sharedComponents/icons';
import {Text} from '../../../sharedComponents/Text';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {MEDIUM_GREY} from '../../../lib/styles';

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

export const DeviceName: NativeNavigationComponent<'DeviceName'> = ({
  navigation,
}) => {
  const [isEditting, setIsEditting] = React.useState(false);
  // set default name to peristed state name
  const [newName, setNewName] = React.useState('');
  const {formatMessage: t} = useIntl();

  const validateAndSetNewName = React.useCallback(() => {
    const newNameTrimmed = newName.trim();
    const nameLength = newNameTrimmed.length;
    if (nameLength < 1 || nameLength > 60) {
      //setErrorTimer here
      return;
    }

    //setToPersistedState
    setIsEditting(false);
  }, [newName, setIsEditting]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          onPress={() =>
            !isEditting ? setIsEditting(true) : validateAndSetNewName()
          }>
          {!isEditting ? <EditIcon /> : <SaveIcon />}
        </IconButton>
      ),
    });
  }, [isEditting, navigation, validateAndSetNewName, setIsEditting]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (!isEditting) {
        // if user is not doing anything then don't intercept back action
        return;
      }

      // Prevent default behavior of leaving the screen
      e.preventDefault();

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
  }, [navigation, isEditting]);

  function handleChangeName(newVal: string) {
    if (newVal.length > 60) {
      //setErrorTimeout here
      return;
    }

    setNewName(newVal);
  }

  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={() => Keyboard.dismiss()}>
      <Text style={{fontWeight: 'bold', marginBottom: 10}}>
        {t(!isEditting ? m.yourDevice : m.editDevice)}
      </Text>
      {!isEditting ? (
        <Text>device name here</Text>
      ) : (
        <React.Fragment>
          <TextInput
            style={{borderColor: MEDIUM_GREY, borderWidth: 1, borderRadius: 5}}
            value={newName}
            onChangeText={handleChangeName}
          />
          <Text
            style={{alignSelf: 'flex-end', marginTop: 10, color: MEDIUM_GREY}}>
            {`${newName.length}/60`}
          </Text>
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
