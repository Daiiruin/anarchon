import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('accusations')
export class Accusation {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ type: 'uuid' })
  declare userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  declare user: User;

  @Column()
  declare caseId: string;

  @Column()
  declare suspectId: string;

  @Column()
  declare motiveId: string;

  @Column()
  declare weaponId: string;

  @Column()
  declare isCorrect: boolean;

  @CreateDateColumn()
  declare submittedAt: Date;
}
