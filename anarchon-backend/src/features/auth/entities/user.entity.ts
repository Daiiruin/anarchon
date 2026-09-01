import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ unique: true })
  declare email: string;

  @Column({ select: false })
  declare password: string;

  @CreateDateColumn()
  declare createdAt: Date;
}
