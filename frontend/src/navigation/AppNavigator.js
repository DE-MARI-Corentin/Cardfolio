// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NewReleasesScreen from '../screens/newReleasesScreen';
import CollectionScreen from '../screens/CollectionScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
    <Stack.Navigator initialRouteName="NewReleases">
      <Stack.Screen 
        name="NewReleases" 
        component={NewReleasesScreen} 
        options={{ title: 'Nouveautés' }}
      />
      <Stack.Screen 
        name="Collection" 
        component={CollectionScreen} 
        options={{ title: 'Ma Collection' }}
      />
    </Stack.Navigator>
);

export default AppNavigator;
