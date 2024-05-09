import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AppStackParamsList,
  HomeTabsParamsList,
} from '../sharedTypes/navigation';

export const useNavigationFromRoot = () =>
  useNavigation<NativeStackNavigationProp<AppStackParamsList>>();

export function useNavigationFromHomeTabs() {
  return useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<HomeTabsParamsList>,
      NativeStackNavigationProp<AppStackParamsList>
    >
  >();
}
