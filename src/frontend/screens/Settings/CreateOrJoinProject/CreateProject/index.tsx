import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../../../sharedTypes';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {Text} from '../../../../sharedComponents/Text';
import * as React from 'react';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {Button} from '../../../../sharedComponents/Button';
import {LIGHT_GREY, MEDIUM_GREY, RED} from '../../../../lib/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useErrorTimeout} from '../../../../hooks/useErrorTimer';

const m = defineMessages({
  title: {
    id: 'screens.Settings.CreateOrJoinProject.CreateProject.title',
    defaultMessage: 'Create a Project',
  },
  enterName: {
    id: 'screens.Settings.CreateOrJoinProject.enterName',
    defaultMessage: 'Enter a name for the Project',
  },
  createProjectButton: {
    id: 'screens.Settings.CreateOrJoinProject.createProjectButton',
    defaultMessage: 'Create Project',
  },
  advancedSettings: {
    id: 'screens.Settings.CreateOrJoinProject.advancedSettings',
    defaultMessage: 'Advanced Project Settings',
  },
  importConfig: {
    id: 'screens.Settings.CreateOrJoinProject.importConfig',
    defaultMessage: 'Import Config',
  },
});

export const CreateProject: NativeNavigationComponent<'CreateProject'> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();
  const [projectName, setProjectName] = React.useState('');
  const [advancedSettingOpen, setAdvancedSettingOpen] = React.useState(false);
  const [error, setErrorTimer] = useErrorTimeout();

  function handleChangeText(val: string) {
    if (val.length > 100) {
      setErrorTimer();
      return;
    }

    setProjectName(val);
  }

  function handleCreateProjectButton() {
    const nameLength = projectName.length;
    if (nameLength < 1 || nameLength > 100) {
      setErrorTimer();
      return;
    }
    // create project here
    // on creation, set projectId in persisted state as new project (this should reset the project at the root level)
    navigation.navigate('ProjectCreated', {name: projectName});
  }

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        style={styles.container}>
        <View>
          <Text style={{marginHorizontal: 20}}>{t(m.enterName)}</Text>
          <TextInput
            value={projectName}
            style={{
              borderWidth: 1,
              borderRadius: 6,
              borderColor: !error ? MEDIUM_GREY : RED,
              marginTop: 10,
              marginHorizontal: 20,
            }}
            onChangeText={handleChangeText}
          />
          <Text
            style={{
              alignSelf: 'flex-end',
              color: !error ? MEDIUM_GREY : RED,
              marginTop: 10,
              marginHorizontal: 20,
            }}>{`${projectName.length}/100`}</Text>
          <View style={{marginTop: 20}}>
            <TouchableOpacity
              onPress={() => setAdvancedSettingOpen(prev => !prev)}
              style={styles.accordianHeader}>
              <Text>{t(m.advancedSettings)}</Text>
              <MaterialIcon
                name={
                  !advancedSettingOpen
                    ? 'keyboard-arrow-up'
                    : 'keyboard-arrow-down'
                }
                size={40}
              />
            </TouchableOpacity>
            {advancedSettingOpen && (
              <View style={{padding: 20}}>
                <Button fullWidth variant="outlined" onPress={() => {}}>
                  {t(m.importConfig)}
                </Button>
              </View>
            )}
          </View>
        </View>
        <View style={{paddingHorizontal: 20}}>
          <Button fullWidth onPress={handleCreateProjectButton}>
            {t(m.createProjectButton)}
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

CreateProject.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  accordianHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    boderColor: LIGHT_GREY,
  },
});
