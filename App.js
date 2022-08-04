import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './navigation/';
import { AuthenticatedUserProvider } from './providers';
import { StripeProvider } from '@stripe/stripe-react-native';

const App = () => {
  return (
    <StripeProvider publishableKey="pk_test_51LT4F4BgPqjmJlMVtfgLChsjIgtrKNCH7zxM1KGv68HIvyhIAnOus5TgQ8bI1iDjlGCcbGwlrqk5oScFhPVaNZlT00iuGDBflQ">
      <AuthenticatedUserProvider>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </AuthenticatedUserProvider>
    </StripeProvider>
  );
};

export default App;
