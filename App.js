/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */



import React, {useEffect} from 'react';
import { Alert } from 'react-native';
import Webview from './Webview';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UnityAds from 'react-native-unity-ads-moon';

const Stack = createStackNavigator();
const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff'
  },
};


const App: () => React$Node = () => {   
  React.useEffect(() => {
    UnityAds.loadAd('4109757', 'Rewarded_Android', false);
  }, []);
  return (
    <>
      <NavigationContainer theme={Theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }} >
          <Stack.Screen name="Webview" component={Webview} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};


export default App;
