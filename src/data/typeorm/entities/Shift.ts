import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShiftSlot } from '../../../domain/entities/Shift.entity';

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'work_day' })
  workDay: Date;

  @Column({ name: 'shift_slot' })
  shiftSlot: ShiftSlot;

  @Column({ name: 'worker_id' })
  workerId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
