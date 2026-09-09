import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProgressStackParamList } from '../types/navigation';
import { ProgressScreen } from '../screens/progress/ProgressScreen';

const Stack = createNativeStackNavigator<ProgressStackParamList>();

export function ProgressStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ProgressHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ProgressHome" component={ProgressScreen} />
    </Stack.Navigator>
  );
}
