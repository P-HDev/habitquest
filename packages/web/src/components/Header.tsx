import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-dark-surface border-b border-dark-border">
      <div className="container mx-auto px-4 py-4 max-w-4xl flex items-center justify-between">
        <Link to="/habits" className="flex items-center gap-2 text-xl font-bold">
          <span>🏆</span>
          <span className="text-primary-400">HabitQuest</span>
        </Link>
        <nav className="flex gap-4">
          <Link to="/habits" className="text-gray-300 hover:text-primary-400 transition-colors">
            Hábitos
          </Link>
        </nav>
      </div>
    </header>
  );
}
