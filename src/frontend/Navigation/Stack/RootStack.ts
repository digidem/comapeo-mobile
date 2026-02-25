import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppStackParamsList} from '../../sharedTypes/navigation';

export const RootStack = createNativeStackNavigator<AppStackParamsList>();
