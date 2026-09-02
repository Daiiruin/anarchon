import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('refresh_sessions')
export class RefreshSession {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column()
  declare userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  declare user: User;

  @Index()
  @Column()
  declare tokenHash: string;

  @Column({ type: 'timestamptz' })
  declare expiresAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  declare revokedAt: Date | null;

  @CreateDateColumn()
  declare createdAt: Date;
}
