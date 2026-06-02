import { AchievementDTO } from '../services/achievements';

interface Props {
  achievement: AchievementDTO;
}

export function AchievementCard({ achievement }: Props) {
  const { title, description, progressPercent, unlocked, currentProgress, targetDays } = achievement;

  const tierColor = unlocked
    ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100'
    : 'border-gray-300 bg-gray-50';

  const iconStyle = unlocked ? 'text-4xl' : 'text-4xl grayscale opacity-50';

  return (
    <div
      className={`relative rounded-xl border-2 p-4 transition-all ${tierColor} ${
        unlocked ? 'shadow-lg shadow-yellow-200' : 'shadow-sm'
      }`}
      data-testid="achievement-card"
    >
      {unlocked && (
        <div className="absolute -top-2 -right-2 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-yellow-900">
          ✓
        </div>
      )}

      <div className="flex flex-col items-center text-center gap-2">
        <span className={iconStyle}>{unlocked ? '🏆' : '🔒'}</span>
        <h3 className="font-semibold text-sm leading-tight">{title}</h3>
        {description && <p className="text-xs text-gray-500">{description}</p>}

        <div className="w-full mt-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                unlocked ? 'bg-yellow-400' : 'bg-blue-400'
              }`}
              style={{ width: `${progressPercent}%` }}
              data-testid="progress-bar"
            />
          </div>
          <span className="text-xs text-gray-500 mt-1 block">
            {currentProgress}/{targetDays} dias
          </span>
        </div>
      </div>
    </div>
  );
}
