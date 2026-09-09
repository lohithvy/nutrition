import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import { CustomTabBar } from '../components/navigation/CustomTabBar';
import { HomeScreen } from '../screens/home/HomeScreen';
import { NutritionStackNavigator } from './NutritionStackNavigator';
import { TrainStackNavigator } from './TrainStackNavigator';
import { ProgressStackNavigator } from './ProgressStackNavigator';
import { YouScreen } from '../screens/you/YouScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="HomeTab"
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="NutritionTab" component={NutritionStackNavigator} />
      <Tab.Screen name="TrainTab" component={TrainStackNavigator} />
      <Tab.Screen name="ProgressTab" component={ProgressStackNavigator} />
      <Tab.Screen name="YouTab" component={YouScreen} />
    </Tab.Navigator>
  );
}
