import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../screens/Home';

type AppStackParamList = {
    Home:undefined,
    ObservationsList:undefined
}

const AppStack = createNativeStackNavigator<AppStackParamList>()

export const AppStackScreens = () => {
    <AppStack.Navigator>
        <AppStack.Screen 
            name={"Home"}
            component={Home}
        />
    </AppStack.Navigator>
}