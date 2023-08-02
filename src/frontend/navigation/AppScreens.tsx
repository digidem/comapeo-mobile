import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../screens/Home';
import { NavigationContainer as NativeNavigationContainer } from '@react-navigation/native';
import ObservationsListView from '../screens/ObservationList';


export type AppStackParamList = {
    Home:undefined,
    ObservationsList:undefined
}

const AppStack = createNativeStackNavigator<AppStackParamList>()

export const NavigationContainer = () => (
    <NativeNavigationContainer>
        <AppStack.Navigator>
            <AppStack.Screen
                name={"ObservationsList"}
                component={ObservationsListView}
            />
        </AppStack.Navigator>
    </NativeNavigationContainer>
)