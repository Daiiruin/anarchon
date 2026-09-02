import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { MediaAsset } from '../../media/entities/media-asset.entity';
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

  @Column({ type: 'uuid', nullable: true })
  declare coverAssetId: string | null;

  @ManyToOne(() => MediaAsset, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'cover_asset_id' })
  declare coverAsset: MediaAsset | null;

  @Column({ type: 'uuid', nullable: true })
  declare detailBackgroundId: string | null;

  @ManyToOne(() => MediaAsset, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'detail_background_id' })
  declare detailBackgroundAsset: MediaAsset | null;

  @Column({ type: 'uuid', nullable: true })
  declare mapAssetId: string | null;

  @ManyToOne(() => MediaAsset, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'map_asset_id' })
  declare mapAsset: MediaAsset | null;

  @Column({ default: 0 })
  declare sortOrder: number;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
