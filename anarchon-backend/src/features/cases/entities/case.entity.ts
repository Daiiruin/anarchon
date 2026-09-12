import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
} from 'typeorm';
import { CasePublicationStatus } from '../enums/case-publication-status.enum';

@Entity('cases')
@Check(`"difficulty" BETWEEN 1 AND 5`)
export class Case {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ unique: true })
  declare slug: string;

  @Column()
  declare title: string;

  @Column()
  declare eraLabel: string;

  @Column({ type: 'text' })
  declare synopsis: string;

  @Column({ type: 'smallint' })
  declare difficulty: number;

  @Column()
  declare themeKey: string;

  @Column({
    type: 'enum',
    enum: CasePublicationStatus,
    default: CasePublicationStatus.DRAFT,
  })
  declare publicationStatus: CasePublicationStatus;

  @Column({ default: 0 })
  declare sortOrder: number;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
