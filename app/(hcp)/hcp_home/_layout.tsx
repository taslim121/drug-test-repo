import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';

const Tabs = withLayoutContext( createMaterialTopTabNavigator().Navigator);
const App = () => {
  return (
    
    <Tabs/>
    
  ); 
};

export default App;
