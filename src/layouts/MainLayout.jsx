import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { Topbar } from '../components/navigation/Topbar';
import { MobileNav } from '../components/navigation/MobileNav';
import { QuickLogDrawer } from '../components/common/QuickLogDrawer';
import { GlobalSearchModal } from '../components/common/GlobalSearchModal';
import { ProPlanModal } from '../components/common/ProPlanModal';
import { DatePickerModal } from '../components/common/DatePickerModal';

export function MainLayout() {
  return (
    <div className="min-h-screen flex bg-surface-50 text-surface-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Desktop Fixed Sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Topbar */}
        <Topbar />

        {/* Dynamic Route Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <MobileNav />

      {/* Global Modals & Drawers */}
      <QuickLogDrawer />
      <GlobalSearchModal />
      <ProPlanModal />
      <DatePickerModal />
    </div>
  );
}
