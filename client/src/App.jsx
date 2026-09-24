import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import PlotsPage from './pages/PlotsPage';
import NewAdvisoryPage from './pages/NewAdvisoryPage';
import DiagnosticPage from './pages/DiagnosticPage';
import HistoryPage from './pages/HistoryPage';
import MarketPage from './pages/MarketPage';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {children}
      </main>
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>AgriVision AI © 2026 • Autonomous Agricultural Intelligence & Crop Health System</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />

          {/* Protected Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/plots"
            element={
              <ProtectedRoute>
                <Layout>
                  <PlotsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/advisory/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <NewAdvisoryPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/diagnostics/scan"
            element={
              <ProtectedRoute>
                <Layout>
                  <DiagnosticPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <Layout>
                  <HistoryPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/market"
            element={
              <ProtectedRoute>
                <Layout>
                  <MarketPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Root and Catch-all Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
