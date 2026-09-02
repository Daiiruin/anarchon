import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { MediaAssetType } from '../enums/media-asset-type.enum';

@Entity('media_assets')
export class MediaAsset {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ nullable: true })
  declare caseId: string | null;

  @Column()
  declare key: string;

  @Column({ type: 'enum', enum: MediaAssetType })
  declare type: MediaAssetType;

  @Column()
  declare storagePath: string;

  @Column()
  declare mimeType: string;

  @Column({ type: 'int', nullable: true })
  declare width: number | null;

  @Column({ type: 'int', nullable: true })
  declare height: number | null;

  @Column({ type: 'int', nullable: true })
  declare durationMs: number | null;

  @Column({ default: false })
  declare isPrivate: boolean;

  @CreateDateColumn()
  declare createdAt: Date;
}
