import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Product } from '../products/product.entity';

@Entity('generations')
export class Generation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.generations, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  longDescription: string;

  @Column({ type: 'text' })
  tags: string;

  @Column({ type: 'text' })
  socialText: string;

  @Column({ type: 'jsonb' })
  rawPrompt: any;

  @CreateDateColumn()
  createdAt: Date;
}
