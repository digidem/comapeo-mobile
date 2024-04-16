import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../../../sharedComponents/Text';
import {Button} from '../../../../sharedComponents/Button';
import {useNavigationFromRoot} from '../../../../hooks/useNavigationWithTypes';

const m = defineMessages({
  projectNecessary: {
    id: 'screens.Setting.ProjectSettings.YourTeam.NotOnProject.projectNecessary',
    defaultMessage: 'Create or Join a Project to invite devices',
  },
  createOrJoin: {
    id: 'screens.Setting.ProjectSettings.YourTeam.NotOnProject.createOrJoin',
    defaultMessage: 'Create or Join Project',
  },
});

export const NotOnProject = () => {
  const {formatMessage} = useIntl();
  const {navigate} = useNavigationFromRoot();
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 32, textAlign: 'center'}}>
        {formatMessage(m.projectNecessary)}
      </Text>
      <Button
        onPress={() => {
          navigate('CreateOrJoinProject');
        }}>
        {formatMessage(m.createOrJoin)}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    padding: 20,
    paddingTop: 40,
  },
});
