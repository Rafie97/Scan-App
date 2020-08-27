/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
global.PaymentRequest = require('react-native-payments').PaymentRequest;

AppRegistry.registerComponent(appName, () => App);
