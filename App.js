import React from 'react';
import Providers from './src/navigation/Providers';
import {LogBox} from 'react-native';
const App = () => {
  LogBox.ignoreAllLogs();
  return <Providers />;
};

export default App;
