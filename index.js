/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Register background handler

AppRegistry.registerComponent(appName, () => App);
