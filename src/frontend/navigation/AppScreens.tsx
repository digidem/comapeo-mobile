import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../screens/Home';
import { NavigationContainer as NativeNavigationContainer } from '@react-navigation/native';
import ObservationsListView from '../screens/ObservationList';
import { Observation } from '../screens/Observation';


export type AppStackParamList = {
    Home:undefined,
    ObservationsList:undefined
    Observation:{observationId:string}
}

const AppStack = createNativeStackNavigator<AppStackParamList>()

export const NavigationContainer = () => (
    <NativeNavigationContainer>
        <AppStack.Navigator>
            <AppStack.Screen
                name={"ObservationsList"}
                component={ObservationsListView}
            />
            <AppStack.Screen
                name={"Home"}
                component={Home}
            />
            <AppStack.Screen
                name={"Observation"}
                component={Observation}
            />
        </AppStack.Navigator>
    </NativeNavigationContainer>
)