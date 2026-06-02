import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    `transition-colors text-sm sm:text-base ${
      pathname === path ? 'text-primary-400 font-semibold' : 'text-gray-300 hover:text-primary-400'
    }`;

  return (
    <header className="bg-dark-surface border-b border-dark-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 max-w-4xl flex items-center justify-between">
        <Link to="/habits" className="flex items-center gap-2 text-lg sm:text-xl font-bold">
          <span>🏆</span>
          <span className="text-primary-400 hidden sm:inline">HabitQuest</span>
        </Link>
        <nav className="flex gap-3 sm:gap-4 items-center">
          <Link to="/habits" className={linkClass('/habits')}>
            Hoje
          </Link>
          <Link to="/achievements" className={linkClass('/achievements')}>
            🏆
          </Link>
          <Link to="/dashboard" className={linkClass('/dashboard')}>
            📊
          </Link>
          <Link to="/settings" className={linkClass('/settings')}>
            ⚙️
          </Link>
        </nav>
      </div>
    </header>
  );
}
