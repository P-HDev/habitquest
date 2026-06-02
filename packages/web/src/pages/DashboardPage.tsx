import { motion } from 'framer-motion';
import { useStats } from '../hooks/useStats';

function StatCard({ label, value, icon, delay }: { label: string; value: string | number; icon: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-dark-surface border border-dark-border rounded-xl p-4 flex flex-col items-center gap-2"
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs text-gray-400 text-center">{label}</span>
    </motion.div>
  );
}

export function DashboardPage() {
  const { stats, loading } = useStats();

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Carregando dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8 text-red-400">Erro ao carregar stats</div>;
  }

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold"
      >
        📊 Dashboard
      </motion.h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard icon="🎯" label="Hábitos Ativos" value={stats.totalHabits} delay={0} />
        <StatCard icon="✅" label="Check-ins Hoje" value={`${stats.completedToday}/${stats.totalHabits}`} delay={0.1} />
        <StatCard icon="🔥" label="Streak Máximo" value={`${stats.maxStreak} dias`} delay={0.2} />
        <StatCard icon="📅" label="Total Check-ins" value={stats.totalCheckins} delay={0.3} />
        <StatCard icon="🏆" label="Conquistas" value={`${stats.unlockedAchievements}/${stats.totalAchievements}`} delay={0.4} />
        <StatCard icon="📈" label="Progresso Geral" value={`${stats.achievementPercent}%`} delay={0.5} />
      </div>

      {stats.maxStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-700/50 rounded-xl p-6 text-center"
        >
          <p className="text-4xl mb-2">🔥</p>
          <p className="text-lg font-bold">Recorde de Streak</p>
          <p className="text-3xl font-bold text-orange-400">{stats.maxStreak} dias seguidos</p>
        </motion.div>
      )}

      {stats.achievementPercent === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-700/50 rounded-xl p-6 text-center"
        >
          <p className="text-4xl mb-2">👑</p>
          <p className="text-lg font-bold text-yellow-400">Todas as conquistas desbloqueadas!</p>
        </motion.div>
      )}
    </div>
  );
}
