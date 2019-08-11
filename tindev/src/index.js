/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import Routes from './routes.js';
import { YellowBox } from 'react-native';

// get rid of all specified warnings
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
]);

// makes component visible to the entire application
export default function App() {
  return (
    <Routes />
  );
}
