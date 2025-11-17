import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateAllDto {
  @IsString()
  @IsNotEmpty()
  productId: string;
}
