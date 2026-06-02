export interface Checkin {
  id?: number;
  habitId: string;
  date: string; // YYYY-MM-DD
}

export interface ICheckinRepository {
  save(checkin: Checkin): Promise<void>;
  remove(habitId: string, date: string): Promise<void>;
  findByHabitAndDate(habitId: string, date: string): Promise<Checkin | null>;
  findDatesByHabit(habitId: string): Promise<string[]>;
  countByHabit(habitId: string): Promise<number>;
}
