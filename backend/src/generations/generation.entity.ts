import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';

/**
 * Generation
 *
 * Representa uma geração completa de conteúdo para um produto.
 * Inclui 4 versões de posts sociais (Instagram, TikTok, Facebook, Pinterest)
 */
@Entity({ name: 'generations' })
export class Generation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.generations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  longDescription: string;

  @Column({ type: 'text' })
  tags: string;

  @Column({ type: 'text' })
  socialInstagram: string;

  @Column({ type: 'text' })
  socialTikTok: string;

  @Column({ type: 'text' })
  socialFacebook: string;

  @Column({ type: 'text' })
  socialPinterest: string;

  @CreateDateColumn()
  createdAt: Date;
}
