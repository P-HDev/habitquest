export class TargetDays {
  private constructor(private readonly _value: number) {}

  static create(days: number): TargetDays {
    if (days < 1) {
      throw new Error('Target days must be at least 1');
    }
    if (days > 365) {
      throw new Error('Target days must be 365 or less');
    }
    return new TargetDays(days);
  }

  get value(): number {
    return this._value;
  }

  progressPercent(completedDays: number): number {
    return Math.min(100, Math.round((completedDays / this._value) * 100));
  }
}
