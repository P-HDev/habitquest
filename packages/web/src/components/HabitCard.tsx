import { Habit } from '../services/habits';

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-4 flex items-center gap-4 hover:border-primary-600 transition-colors">
      <span className="text-3xl" role="img" aria-label={habit.name}>
        {habit.icon}
      </span>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-100">{habit.name}</h3>
        {habit.description && <p className="text-sm text-gray-400 mt-1">{habit.description}</p>}
        <p className="text-xs text-gray-500 mt-1">Meta: {habit.targetDays} dias</p>
      </div>
      <div className="text-right">
        <span className="text-xs text-primary-400 font-mono">0/{habit.targetDays}</span>
        <div className="w-20 h-2 bg-dark-border rounded-full mt-1">
          <div className="h-full bg-primary-500 rounded-full" style={{ width: '0%' }} />
        </div>
      </div>
    </div>
  );
}
