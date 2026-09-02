import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Case } from './case.entity';
import { CaseElementType } from '../enums/case-element-type.enum';

@Entity('case_elements')
@Unique(['caseId', 'key'])
export class CaseElement {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ type: 'uuid' })
  declare caseId: string;

  @ManyToOne(() => Case, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'case_id' })
  declare case: Case;

  @Column()
  declare key: string;

  @Column({ type: 'enum', enum: CaseElementType })
  declare type: CaseElementType;

  @Column({ default: false })
  declare isInitiallyUnlocked: boolean;

  @Column({ default: 0 })
  declare sortOrder: number;
}
