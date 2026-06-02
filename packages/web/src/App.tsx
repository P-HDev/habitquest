import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HabitsPage } from './pages/HabitsPage';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="*" element={<Navigate to="/habits" replace />} />
      </Routes>
    </Layout>
  );
}
