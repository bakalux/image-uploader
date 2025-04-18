import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalName: string;

  @Column()
  key: string;

  @Column({ nullable: true })
  processedKey: string;

  @Column()
  status: string;

  @Column()
  size: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  uploadedAt: Date;
}
