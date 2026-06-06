import * as React from 'react';
import type {Decorator} from '@storybook/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

/**
 * Navigation decorator - wraps a single screen component in NavigationContainer
 * + NativeStack.Navigator + NativeStack.Screen.
 *
 * Provides useNavigation(), useRoute(), useFocusEffect() context.
 * Accepts initial route params via story parameters.
 *
 * IMPORTANT: This bypasses RootStackNavigator entirely (no auth checks,
 * no device name checks, no ActiveProjectProvider). Screens that depend
 * on ActiveProjectProvider should use the fullApp decorator instead.
 */
export const withNavigation: Decorator = (Story, context) => {
  const Stack = createNativeStackNavigator();
  const params = context.parameters?.navigation?.params;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="StoryScreen"
          component={Story}
          initialParams={params}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
