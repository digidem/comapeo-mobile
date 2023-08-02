import * as React from 'react';
import nodejs from 'nodejs-mobile-react-native';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { NavigationContainer } from './navigation/AppScreens';
import { ClientApiProvider } from './contexts/ClientApiProvider';

const queryClient = new QueryClient()


const App = () => {
  nodejs.start('loader.js');

  return (
    <ClientApiProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer/>
      </QueryClientProvider>
    </ClientApiProvider>
  );
};

export default App;
