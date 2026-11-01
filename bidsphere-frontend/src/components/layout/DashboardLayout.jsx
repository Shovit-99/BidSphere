import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardTopbar from './DashboardTopbar';
import DashboardMetricsCards from './DashboardMetricsCards';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-100 flex relative antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Top Ambient Blue Glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[450px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.15),transparent)] z-0" />

      {/* Left Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Column */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen relative z-10">
        <DashboardTopbar 
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* 4 Gradient Stat Cards (rendered on all dashboard views as shown in Image 1 & 2) */}
          <DashboardMetricsCards />

          {/* Page Body */}
          <Outlet context={{ searchQuery, setSearchQuery }} />
        </main>
      </div>
    </div>
  );
}
