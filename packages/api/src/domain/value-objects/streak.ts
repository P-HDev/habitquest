interface StreakOptions {
  includeYesterday?: boolean;
}

export class Streak {
  private constructor(private readonly _value: number) {}

  static fromDates(dates: string[], today: Date, options?: StreakOptions): Streak {
    if (dates.length === 0) return new Streak(0);

    const sorted = [...dates].sort().reverse();
    const todayStr = toDateString(today);
    const yesterdayStr = toDateString(addDays(today, -1));

    const startsToday = sorted[0] === todayStr;
    const startsYesterday = sorted[0] === yesterdayStr;

    if (!startsToday && !(options?.includeYesterday && startsYesterday)) {
      return new Streak(0);
    }

    let count = 1;
    let expectedDate = startsToday ? todayStr : yesterdayStr;

    for (let i = 1; i < sorted.length; i++) {
      expectedDate = toDateString(addDays(parseDate(expectedDate), -1));
      if (sorted[i] === expectedDate) {
        count++;
      } else {
        break;
      }
    }

    return new Streak(count);
  }

  get value(): number {
    return this._value;
  }

  get label(): string {
    return `🔥 ${this._value}`;
  }
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00.000Z');
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}
