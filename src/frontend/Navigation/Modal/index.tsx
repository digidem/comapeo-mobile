import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export type ModalScreens = {
  MediaSyncModal: undefined;
};

const ModalStack = createNativeStackNavigator<ModalScreens>();

export const ModalStackNavigator = () => {
  return (
    <ModalStack.Navigator>
      <ModalStack.Screen component={} name="MediaSyncModal" />
    </ModalStack.Navigator>
  );
};
