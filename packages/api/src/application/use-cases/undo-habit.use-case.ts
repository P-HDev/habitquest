import { ICheckinRepository } from '../../domain/repositories/checkin.repository.js';

export class UndoHabitUseCase {
  constructor(private readonly checkinRepository: ICheckinRepository) {}

  async execute(habitId: string, date?: string): Promise<{ removed: boolean }> {
    const today = date || new Date().toISOString().split('T')[0];
    const existing = await this.checkinRepository.findByHabitAndDate(habitId, today);

    if (!existing) {
      return { removed: false };
    }

    await this.checkinRepository.remove(habitId, today);
    return { removed: true };
  }
}
