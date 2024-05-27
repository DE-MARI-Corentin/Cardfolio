// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NewReleasesScreen from '../screens/newReleasesScreen';
import CollectionScreen from '../screens/CollectionScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
    <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="NewReleases">
            <Stack.Screen name="NewReleases" component={NewReleasesScreen} />
            <Stack.Screen name="Collection" component={CollectionScreen} />
        </Stack.Navigator>
    </NavigationContainer>
);

export default AppNavigator;
