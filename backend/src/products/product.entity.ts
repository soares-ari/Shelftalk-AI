import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Product
 *
 * Representa um produto cadastrado pelo usuário.
 * Este será o ponto de partida para gerar descrições,
 * títulos e outros conteúdos via IA.
 */
@Entity({ name: 'products' })
export class Product {
  /**
   * ID único em formato UUID.
   * O TypeORM gera automaticamente.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Nome do produto.
   * Exemplo: "Camiseta Oversized - Preto"
   */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * Pequena descrição fornecida pelo usuário.
   * Isso complementa o prompt para gerar textos melhores.
   *
   * ✅ CORREÇÃO: Tipo explícito 'text' para evitar ambiguidade
   */
  @Column({ type: 'text', nullable: true })
  description: string | null;

  /**
   * ID do usuário dono do produto.
   * FUTURO: será chave estrangeira para Users.
   *
   * ✅ CORREÇÃO: Tipo explícito 'uuid'
   */
  @Column({ type: 'uuid' })
  ownerId: string;

  /**
   * Timestamp automático de criação.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp automático de atualização.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
