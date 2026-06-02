import { useState } from 'react';

interface CreateHabitFormProps {
  onSubmit: (data: {
    name: string;
    targetDays: number;
    description?: string;
    icon?: string;
  }) => Promise<void>;
}

export function CreateHabitForm({ onSubmit }: CreateHabitFormProps) {
  const [name, setName] = useState('');
  const [targetDays, setTargetDays] = useState(30);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await onSubmit({
        name,
        targetDays,
        description: description || undefined,
      });
      setName('');
      setTargetDays(30);
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar hábito');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-dark-surface border border-dark-border rounded-lg p-4 space-y-3"
    >
      <h3 className="font-semibold text-primary-400">Novo Hábito</h3>

      {error && (
        <p className="text-red-400 text-sm" role="alert">
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Nome do hábito"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500"
      />

      <input
        type="text"
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500"
      />

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-400">Meta:</label>
        <input
          type="number"
          min={1}
          max={365}
          value={targetDays}
          onChange={(e) => setTargetDays(Number(e.target.value))}
          className="w-20 bg-dark-bg border border-dark-border rounded px-2 py-1 text-gray-100 focus:outline-none focus:border-primary-500"
        />
        <span className="text-sm text-gray-400">dias</span>
      </div>

      <button
        type="submit"
        disabled={submitting || !name.trim()}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-2 rounded transition-colors"
      >
        {submitting ? 'Criando...' : 'Criar Hábito'}
      </button>
    </form>
  );
}
