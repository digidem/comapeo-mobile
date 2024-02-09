import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {BackHandler, StyleSheet, View} from 'react-native';
import GreenCheck from '../../../../images/GreenCheck.svg';
import {NativeRootNavigationProps} from '../../../../sharedTypes';
import {Text} from '../../../../sharedComponents/Text';
import {Button} from '../../../../sharedComponents/Button';
import {CommonActions, useFocusEffect} from '@react-navigation/native';

const m = defineMessages({
  projectCreated: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.projectCreated',
    defaultMessage: '{projectName} Created!',
  },
  inviteDevice: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.invitedDevice',
    defaultMessage: 'Invite Device',
  },
  goToMap: {
    id: 'screens.Settings.CreateOrJoinProject.ProjectCreated.goToMap',
    defaultMessage: 'Go to Map',
  },
});

export const ProjectCreated = ({
  route,
  navigation,
}: NativeRootNavigationProps<'ProjectCreated'>) => {
  const {formatMessage: t} = useIntl();

  // disables back button
  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      return () => subscription.remove();
    }, []),
  );

  function handleGoToMap() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  }

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <GreenCheck />
        <Text
          style={{
            textAlign: 'center',
            fontSize: 24,
            marginTop: 10,
            fontWeight: 'bold',
          }}>
          {t(m.projectCreated, {projectName: route.params.name})}
        </Text>
      </View>
      <View style={{width: '100%'}}>
        <Button fullWidth variant="outlined" onPress={() => {}}>
          {t(m.inviteDevice)}
        </Button>
        <Button style={{marginTop: 20}} fullWidth onPress={handleGoToMap}>
          {t(m.goToMap)}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-between',
  },
});
