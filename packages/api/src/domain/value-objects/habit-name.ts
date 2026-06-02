export class HabitName {
  private constructor(private readonly _value: string) {}

  static create(name: string): HabitName {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error('Habit name is required');
    }
    if (trimmed.length > 100) {
      throw new Error('Habit name must be 100 characters or less');
    }
    return new HabitName(trimmed);
  }

  get value(): string {
    return this._value;
  }

  equals(other: HabitName): boolean {
    return this._value === other._value;
  }
}
