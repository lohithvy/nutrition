import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TrainStackParamList } from '../types/navigation';
import { TrainHomeScreen } from '../screens/train/TrainHomeScreen';
import { ActiveWorkoutScreen } from '../screens/train/ActiveWorkoutScreen';
import { WorkoutSplitEditorScreen } from '../screens/train/WorkoutSplitEditorScreen';

const Stack = createNativeStackNavigator<TrainStackParamList>();

export function TrainStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="TrainHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="TrainHome" component={TrainHomeScreen} />
      <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
      <Stack.Screen name="WorkoutSplitEditor" component={WorkoutSplitEditorScreen} />
    </Stack.Navigator>
  );
}
