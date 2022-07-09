import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './navigation/';
import { AuthenticatedUserProvider } from './providers';

const App = () => {
  return (
    <AuthenticatedUserProvider>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </AuthenticatedUserProvider>
  );
};

export default App;
