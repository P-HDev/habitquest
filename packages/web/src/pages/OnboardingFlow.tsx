import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SUGGESTED_HABITS = [
  { name: '🧘 Meditação', icon: '🧘', targetDays: 30 },
  { name: '🏋️ Exercício', icon: '🏋️', targetDays: 30 },
  { name: '📚 Leitura', icon: '📚', targetDays: 30 },
  { name: '💧 Beber Água', icon: '💧', targetDays: 30 },
  { name: '😴 Dormir Cedo', icon: '😴', targetDays: 30 },
  { name: '💻 Codar', icon: '💻', targetDays: 30 },
  { name: '📝 Journaling', icon: '📝', targetDays: 30 },
  { name: '🚶 Caminhar', icon: '🚶', targetDays: 30 },
  { name: '🍎 Alimentação Saudável', icon: '🍎', targetDays: 30 },
  { name: '🎯 Foco (sem celular)', icon: '🎯', targetDays: 21 },
];

interface OnboardingProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [selectedHabits, setSelectedHabits] = useState<number[]>([]);
  const navigate = useNavigate();

  const toggleHabit = (idx: number) => {
    setSelectedHabits((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const createHabits = async () => {
    for (const idx of selectedHabits) {
      const h = SUGGESTED_HABITS[idx];
      await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: h.name, targetDays: h.targetDays }),
      });
    }
  };

  const finish = async () => {
    if (selectedHabits.length > 0) {
      await createHabits();
    }
    localStorage.setItem('onboarding_done', 'true');
    onComplete();
    navigate('/habits');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-dark-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Progress */}
        <div className="flex gap-2">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                s <= step ? 'bg-primary-400' : 'bg-dark-border'
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-6 text-center">
            <h1 className="text-3xl font-bold">🏆 Bem-vindo ao HabitQuest!</h1>
            <p className="text-gray-400">Transforme seus hábitos em conquistas épicas.</p>

            <div className="space-y-3 text-left">
              <label className="text-sm text-gray-400">Como quer ser chamado?</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-primary-400"
                placeholder="Seu nome"
              />
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg"
            >
              Próximo →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">🎯 Escolha seus hábitos</h1>
              <p className="text-gray-400 text-sm mt-1">Selecione pelo menos 1 (recomendamos 3)</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SUGGESTED_HABITS.map((habit, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleHabit(idx)}
                  className={`p-3 rounded-lg border text-left text-sm transition-all ${
                    selectedHabits.includes(idx)
                      ? 'bg-primary-500/20 border-primary-400 text-primary-300'
                      : 'bg-dark-surface border-dark-border text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {habit.name}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex-1 border border-dark-border text-gray-400 py-3 rounded-lg hover:bg-dark-surface"
              >
                ← Voltar
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg"
              >
                Próximo →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center">
            <h1 className="text-2xl font-bold">📖 Como funciona</h1>

            <div className="space-y-4 text-left">
              <div className="bg-dark-surface border border-dark-border rounded-lg p-4 flex gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold">Check-in diário</p>
                  <p className="text-sm text-gray-400">Marque seus hábitos como feitos todos os dias</p>
                </div>
              </div>

              <div className="bg-dark-surface border border-dark-border rounded-lg p-4 flex gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="font-semibold">Streaks</p>
                  <p className="text-sm text-gray-400">Dias consecutivos geram streaks — não quebre a corrente!</p>
                </div>
              </div>

              <div className="bg-dark-surface border border-dark-border rounded-lg p-4 flex gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-semibold">Conquistas</p>
                  <p className="text-sm text-gray-400">Desbloqueie achievements ao atingir 7, 21, 30+ dias</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-dark-border text-gray-400 py-3 rounded-lg hover:bg-dark-surface"
              >
                ← Voltar
              </button>
              <button
                onClick={finish}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg"
              >
                🚀 Começar!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
