import * as React from 'react';
import nodejs from 'nodejs-mobile-react-native';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { NavigationContainer } from './navigation/AppScreens';
import { ClientApiProvider } from './contexts/ClientApiProvider';
import { initClientApi } from './lib/ClientApi';

const queryClient = new QueryClient()
nodejs.start('loader.js');
const client = initClientApi()

const App = () => {
  


  return (
    <ClientApiProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer/>
      </QueryClientProvider>
    </ClientApiProvider>
  );
};

export default App;
