/**
 * DTO para padronizar respostas de produto ao cliente.
 * Evita expor entidades diretamente.
 */
export class ProductResponseDto {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
