/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import Webview from './Webview';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
  },
};

const App = () => {
  return (
    <>
      <NavigationContainer theme={Theme}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Webview" component={Webview} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
