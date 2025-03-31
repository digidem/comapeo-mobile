import {useManyInvites} from '@comapeo/core-react';
import {useEffect} from 'react';
import {isEditingScreen} from '../lib/isEditingScreen';
import {RouteProp} from '@react-navigation/native';
import {AppStackParamsList} from '../sharedTypes/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export const InvitesListener = ({
  route,
  navigation,
}: {
  route: RouteProp<AppStackParamsList, keyof AppStackParamsList>;
  navigation: NativeStackNavigationProp<
    AppStackParamsList,
    keyof AppStackParamsList
  >;
}) => {
  const {data: invites} = useManyInvites();
  const currentRoute = route.name;

  useEffect(() => {
    const invite = invites.find(i => i.state === 'pending');
    if (invite && !isEditingScreen(currentRoute)) {
      // TO DO navigate to invite screen, this is a placeholder
      navigation.navigate('ProjectSettings');
    }
  }, [invites, currentRoute, navigation]);
  return null;
};
