import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from '../../sharedComponents/Button';
import ErrorIcon from '../../images/Error.svg';
import {defineMessages, useIntl} from 'react-intl';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackList} from '../../Navigation/AppStack';
import {Text} from '../../sharedComponents/Text';
import {useProjectSettings} from '../../hooks/server/projects';
import {RED} from '../../lib/styles';
import {useQueryClient} from '@tanstack/react-query';
import {INVITE_KEY} from '../../hooks/server/invites';

const m = defineMessages({
  leaveProj: {
    id: 'screens.LeaveProject.AlreadyOnProject.leaveProj',
    defaultMessage: 'Leave Current Project',
  },
  goBack: {
    id: 'screens.goBackect.AlreadyOnProject.goBack',
    defaultMessage: 'Go Back',
  },
  alreadyOnProject: {
    id: 'screens.goBackect.AlreadyOnProject.alreadyOnProject',
    defaultMessage: 'You are already on a project',
  },
  onProject: {
    id: 'screens.goBackect.AlreadyOnProject.onProject',
    defaultMessage: 'You are on {projectName}',
  },
  leaveWarning: {
    id: 'screens.goBackect.AlreadyOnProject.leaveWarning',
    defaultMessage: 'To join a new project you must leave your current one.',
  },
});

export const AlreadyOnProject = ({
  navigation,
  route,
}: NativeStackScreenProps<AppStackList, 'AlreadyOnProject'>) => {
  const {formatMessage} = useIntl();
  const {data} = useProjectSettings();
  const queryClient = useQueryClient();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <ErrorIcon />
        <Text
          style={[
            styles.text,
            {marginTop: 20, fontSize: 32, fontWeight: 'bold'},
          ]}>
          {formatMessage(m.alreadyOnProject)}
        </Text>
        {data?.name && (
          <Text style={[styles.text, {marginTop: 10}]}>
            {formatMessage(m.onProject, {projectName: data.name})}
          </Text>
        )}
        <Text style={[styles.text, {marginTop: 10}]}>
          {formatMessage(m.leaveWarning)}
        </Text>
      </View>
      <View style={{width: '100%'}}>
        <Button
          fullWidth
          style={{backgroundColor: RED}}
          variant="contained"
          onPress={() => navigation.navigate('LeaveProject', route.params)}>
          {formatMessage(m.leaveProj)}
        </Button>
        <Button
          style={{marginTop: 20}}
          fullWidth
          variant="outlined"
          onPress={() => {
            navigation.goBack();
            queryClient.invalidateQueries({queryKey: [INVITE_KEY]});
          }}>
          {formatMessage(m.goBack)}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  text: {
    textAlign: 'center',
  },
});
