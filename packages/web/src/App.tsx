import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HabitsPage } from './pages/HabitsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { SettingsPage } from './pages/SettingsPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { OnboardingFlow } from './pages/OnboardingFlow';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useState } from 'react';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-8 text-gray-400">...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState(
    () => localStorage.getItem('onboarding_done') === 'true'
  );

  if (loading) return null;

  // Show onboarding for logged-in users who haven't completed it
  if (user && !onboardingDone) {
    return <OnboardingFlow onComplete={() => setOnboardingDone(true)} />;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/habits" replace /> : <LoginPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/habits" element={<HabitsPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/habits" replace />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
