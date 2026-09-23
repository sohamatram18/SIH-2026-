import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext.jsx';
import { Header } from './components/Header.jsx';
import { BottomNav } from './components/BottomNav.jsx';
import { JagoChatDrawer } from './components/JagoChatDrawer.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { SchemesPage } from './pages/SchemesPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { GuardianWardsPage } from './pages/GuardianWardsPage.jsx';
import { ApplicationWizardPage } from './pages/ApplicationWizardPage.jsx';
import { DocumentWalletPage } from './pages/DocumentWalletPage.jsx';
import { PaymentsTrackerPage } from './pages/PaymentsTrackerPage.jsx';
import { GrievancePage } from './pages/GrievancePage.jsx';
import { OfficerConsolePage } from './pages/OfficerConsolePage.jsx';
import { OfflineBanner } from './components/OfflineBanner.jsx';
import { Bot, Sparkles } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gov-blue"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppContent = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [jagoOpen, setJagoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gov-surface flex flex-col justify-between relative">
      <div>
        <OfflineBanner />
        <Header onOpenJago={() => setJagoOpen(true)} />
        <main className="pb-16 sm:pb-8">
          <Routes>
            {/* Redesigned 10-Section Landing Portal */}
            <Route path="/" element={<HomePage onOpenJago={() => setJagoOpen(true)} />} />
            <Route path="/home" element={<HomePage onOpenJago={() => setJagoOpen(true)} />} />

            {/* Student Application Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guardian"
              element={
                <ProtectedRoute>
                  <GuardianWardsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply/:schemeCode"
              element={
                <ProtectedRoute>
                  <ApplicationWizardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply/:schemeCode/:applicationId"
              element={
                <ProtectedRoute>
                  <ApplicationWizardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <DocumentWalletPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <PaymentsTrackerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/grievance"
              element={
                <ProtectedRoute>
                  <GrievancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer"
              element={
                <ProtectedRoute allowedRoles={['institute_nodal', 'state_nodal', 'mota_admin']}>
                  <OfficerConsolePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Floating Action Button (FAB) for JAGO AI */}
      <div className="fixed bottom-18 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setJagoOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold px-3.5 sm:px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 transition hover:scale-105 border-2 border-white ring-4 ring-amber-400/30"
          title="Ask JAGO Tribal Scholarship AI"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <span className="text-xs tracking-wide">Ask JAGO</span>
        </button>
      </div>

      {/* JAGO AI Assistant Drawer */}
      <JagoChatDrawer isOpen={jagoOpen} onClose={() => setJagoOpen(false)} />

      {user && <BottomNav />}
    </div>
  );
};

export const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
