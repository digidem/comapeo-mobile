import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackList} from '../Navigation/Stack';
import {type HomeTabsList} from '../Navigation/Tab';

export const useNavigationFromRoot = () =>
  useNavigation<NativeStackNavigationProp<AppStackList>>();

export function useNavigationFromHomeTabs() {
  return useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<HomeTabsList>,
      NativeStackNavigationProp<AppStackList>
    >
  >();
}
