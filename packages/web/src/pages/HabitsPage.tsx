import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { HabitCard } from '../components/HabitCard';
import { CreateHabitForm } from '../components/CreateHabitForm';

export function HabitsPage() {
  const { habits, loading, error, add, toggle } = useHabits();
  const [showForm, setShowForm] = useState(false);

  const completedCount = habits.filter((h) => h.completedToday).length;
  const totalCount = habits.length;

  const handleCreate = async (data: { name: string; targetDays: number; description?: string; icon?: string }) => {
    await add(data);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hoje</h1>
          {totalCount > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              {completedCount}/{totalCount} hábitos completados
              {completedCount === totalCount && totalCount > 0 && ' 🎉'}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>{showForm ? '✕' : '+'}</span>
          <span>{showForm ? 'Cancelar' : 'Novo Hábito'}</span>
        </button>
      </div>

      {showForm && <CreateHabitForm onSubmit={handleCreate} />}

      {loading && (
        <div className="text-center py-8 text-gray-400">Carregando...</div>
      )}

      {error && (
        <div className="text-center py-8 text-red-400" role="alert">{error}</div>
      )}

      {!loading && !error && habits.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-4">🎯</p>
          <p className="text-lg">Nenhum hábito ainda</p>
          <p className="text-sm mt-2">Crie seu primeiro hábito e comece a conquistar!</p>
        </div>
      )}

      {!loading && habits.length > 0 && (
        <div className="space-y-3">
          {habits.map((todayHabit) => (
            <HabitCard
              key={todayHabit.habit.id}
              todayHabit={todayHabit}
              onToggle={toggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
