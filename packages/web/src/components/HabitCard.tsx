import { motion } from 'framer-motion';
import { TodayHabit } from '../services/habits';

interface HabitCardProps {
  todayHabit: TodayHabit;
  onToggle: (habitId: string, completed: boolean) => void;
}

function streakColor(streak: number): string {
  if (streak >= 30) return 'text-red-400';
  if (streak >= 14) return 'text-orange-400';
  if (streak >= 7) return 'text-yellow-400';
  return 'text-gray-400';
}

export function HabitCard({ todayHabit, onToggle }: HabitCardProps) {
  const { habit, completedToday, streak, totalCompleted } = todayHabit;
  const progress = Math.min(100, Math.round((totalCompleted / habit.targetDays) * 100));

  return (
    <motion.div
      onClick={() => onToggle(habit.id, completedToday)}
      whileTap={{ scale: 0.97 }}
      layout
      className={`bg-dark-surface border rounded-lg p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 ${
        completedToday
          ? 'border-primary-500 bg-primary-500/10 shadow-md shadow-primary-500/20'
          : 'border-dark-border hover:border-primary-600'
      }`}
      role="button"
      aria-pressed={completedToday}
      aria-label={`${habit.name} - ${completedToday ? 'completado' : 'não completado'}`}
    >
      <motion.div
        animate={{ scale: completedToday ? 1.1 : 1, rotate: completedToday ? [0, -10, 10, 0] : 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl"
      >
        {completedToday ? '✅' : habit.icon}
      </motion.div>

      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold truncate ${completedToday ? 'text-primary-300' : 'text-gray-100'}`}>
          {habit.name}
        </h3>
        {habit.description && (
          <p className="text-sm text-gray-400 mt-0.5 truncate">{habit.description}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5">
          <div className="flex-1 max-w-32">
            <div className="w-full h-1.5 bg-dark-border rounded-full">
              <motion.div
                className="h-full bg-primary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-500">{totalCompleted}/{habit.targetDays}</span>
        </div>
      </div>

      {streak > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`text-right ${streakColor(streak)}`}
          aria-label={`streak ${streak} dias`}
        >
          <span className="text-lg font-bold">🔥 {streak}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
