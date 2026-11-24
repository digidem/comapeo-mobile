import {CommonActions, NavigationProp} from '@react-navigation/native';
import type {AppStackParamsList} from '../sharedTypes/navigation';

type Navigation = NavigationProp<AppStackParamsList>;
type Dispatch = Navigation['dispatch'];

export function resetToYourTeam(dispatch: Dispatch) {
  dispatch(
    CommonActions.reset({
      index: 2,
      routes: [{name: 'Home'}, {name: 'ProjectSettings'}, {name: 'YourTeam'}],
    }),
  );
}
