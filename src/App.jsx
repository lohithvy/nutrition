import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NutritionProvider } from './context/NutritionContext';
import { UIProvider } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { DiaryPage } from './pages/DiaryPage';
import { MealPlanPage } from './pages/MealPlanPage';
import { GroceryPage } from './pages/GroceryPage';
import { InsightsPage } from './pages/InsightsPage';
import { ProgressPage } from './pages/ProgressPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { RecipesPage } from './pages/RecipesPage';
import { ScannerPage } from './pages/ScannerPage';
import { BarcodeScannerPage } from './pages/BarcodeScannerPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginModal } from './components/auth/LoginModal';
import { SignupModal } from './components/auth/SignupModal';
import { SignoutConfirmModal } from './components/auth/SignoutConfirmModal';

export default function App() {
  return (
    <NutritionProvider>
      <AuthProvider>
        <UIProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="diary" element={<DiaryPage />} />
              <Route path="assistant" element={<AIAssistantPage />} />
              <Route path="ai-assistant" element={<Navigate to="/assistant" replace />} />
              <Route path="insights" element={<InsightsPage />} />
              <Route path="meal-planner" element={<MealPlanPage />} />
              <Route path="meal-plan" element={<Navigate to="/meal-planner" replace />} />
              <Route path="grocery" element={<GroceryPage />} />
              <Route path="recipes" element={<RecipesPage />} />
              <Route path="scanner" element={<ScannerPage />} />
              <Route path="barcode-scanner" element={<BarcodeScannerPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>

          {/* Global Auth Modals */}
          <LoginModal />
          <SignupModal />
          <SignoutConfirmModal />
        </UIProvider>
      </AuthProvider>
    </NutritionProvider>
  );
}
