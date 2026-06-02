import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HabitsPage } from './pages/HabitsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { SettingsPage } from './pages/SettingsPage';
import { DashboardPage } from './pages/DashboardPage';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/habits" replace />} />
      </Routes>
    </Layout>
  );
}
