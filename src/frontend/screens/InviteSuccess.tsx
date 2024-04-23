import * as React from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import GreenCheck from '../images/GreenCheck.svg';
import {Button} from '../sharedComponents/Button';
import {defineMessages, useIntl} from 'react-intl';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackList} from '../Navigation/AppStack';
import {Text} from '../sharedComponents/Text';
import {useProjectSettings} from '../hooks/server/projects';
import {useFocusEffect} from '@react-navigation/native';

const m = defineMessages({
  success: {
    id: 'screens.InviteSuccess.success',
    defaultMessage: 'Success',
  },
  goToMap: {
    id: 'screens.InviteSuccess.goToMap',
    defaultMessage: 'Go To Map',
  },
  goToSync: {
    id: 'screens.InviteSuccess.goToSync',
    defaultMessage: 'Go To Sync',
  },
  newProject: {
    id: 'screens.InviteSuccess.newProject',
    defaultMessage: 'You have joined {projectName}',
  },
});

export const InviteSuccess = ({
  navigation,
}: NativeStackScreenProps<AppStackList, 'InviteSuccess'>) => {
  const {formatMessage} = useIntl();
  const {data} = useProjectSettings();

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

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <GreenCheck />
        <Text
          style={[
            styles.text,
            {marginTop: 20, fontSize: 32, fontWeight: 'bold'},
          ]}>
          {formatMessage(m.success)}
        </Text>
        {data?.name && (
          <Text style={[styles.text, {marginTop: 10}]}>
            {formatMessage(m.newProject, {projectName: data.name})}
          </Text>
        )}
      </View>
      <View style={{width: '100%'}}>
        <Button
          fullWidth
          variant="outlined"
          onPress={() => navigation.navigate('Home', {screen: 'Map'})}>
          {formatMessage(m.goToMap)}
        </Button>
        {/* <Button
          style={{marginTop: 20}}
          fullWidth
          onPress={() => navigation.}>
          {formatMessage(m.goToSync)}
        </Button> */}
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
