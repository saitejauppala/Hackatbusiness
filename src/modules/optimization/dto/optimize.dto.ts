import { IsString, IsNotEmpty } from 'class-validator';

export class OptimizeDto {
  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  destination: string;
}
