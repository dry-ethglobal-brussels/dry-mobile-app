import {createNativeStackNavigator} from '@react-navigation/native-stack';
import config from './tamagui.config';
import React from 'react';
import {TamaguiProvider} from 'tamagui';
import Home from './pages/home';
import {NavigationContainer} from '@react-navigation/native';
import Networks from './pages/networks';
import Currencies from './pages/currencies';
import Send from './pages/send';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <TamaguiProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Networks" component={Networks} />
          <Stack.Screen name="Currencies" component={Currencies} />
          <Stack.Screen name="Send" component={Send} />
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}

export default App;
