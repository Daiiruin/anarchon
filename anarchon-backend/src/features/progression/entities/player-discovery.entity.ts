import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('player_discoveries')
@Unique(['userId', 'caseId', 'elementId'])
export class PlayerDiscovery {
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
  declare elementId: string;

  @CreateDateColumn()
  declare discoveredAt: Date;
}
