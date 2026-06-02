import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isRegister) {
        await register(email, name, password);
      } else {
        await login(email, password);
      }
      navigate('/habits');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-dark-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">🏆</h1>
          <h2 className="text-2xl font-bold text-primary-400 mt-2">HabitQuest</h2>
          <p className="text-gray-400 text-sm mt-1">
            {isRegister ? 'Crie sua conta' : 'Entre na sua conta'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-400"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-400"
            required
          />

          <input
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-400"
            required
            minLength={6}
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {submitting ? '...' : isRegister ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          {isRegister ? 'Já tem conta?' : 'Não tem conta?'}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-primary-400 hover:underline"
          >
            {isRegister ? 'Fazer login' : 'Criar conta'}
          </button>
        </p>
      </div>
    </div>
  );
}
