import {CommonActions, NavigationProp} from '@react-navigation/native';
import type {AppStackParamsList} from '../sharedTypes/navigation';

export function resetToYourTeam(
  navigation: NavigationProp<AppStackParamsList>,
) {
  navigation.dispatch(
    CommonActions.reset({
      index: 2,
      routes: [{name: 'Home'}, {name: 'ProjectSettings'}, {name: 'YourTeam'}],
    }),
  );
}
