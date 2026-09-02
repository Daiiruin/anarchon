import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Case } from '../../cases/entities/case.entity';
import { CaseElement } from '../../cases/entities/case-element.entity';

@Entity('case_progress')
@Unique(['userId', 'caseId'])
export class CaseProgress {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ type: 'uuid' })
  declare userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  declare user: User;

  @Column({ type: 'uuid' })
  declare caseId: string;

  @ManyToOne(() => Case, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'case_id' })
  declare case: Case;

  @Column({ type: 'timestamptz' })
  declare startedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  declare completedAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  declare lastLocationElementId: string | null;

  @ManyToOne(() => CaseElement, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'last_location_element_id' })
  declare lastLocationElement: CaseElement | null;
}
