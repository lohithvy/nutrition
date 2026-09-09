import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { NutritionProvider } from './src/context/NutritionContext';
import { WorkoutProvider } from './src/context/WorkoutContext';
import { UIProvider } from './src/context/UIContext';
import { RootNavigator } from './src/navigation/RootNavigator';

// Global Modals
import { QuickLogBottomSheet } from './src/components/common/QuickLogBottomSheet';
import { DatePickerModal } from './src/components/common/DatePickerModal';
import { ProPlanModal } from './src/components/common/ProPlanModal';
import { GlobalSearchModal } from './src/components/common/GlobalSearchModal';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NutritionProvider>
          <WorkoutProvider>
            <UIProvider>
              <StatusBar style="dark" />
              <RootNavigator />

              {/* Global Interactive Overlays */}
              <QuickLogBottomSheet />
              <DatePickerModal />
              <ProPlanModal />
              <GlobalSearchModal />
            </UIProvider>
          </WorkoutProvider>
        </NutritionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
