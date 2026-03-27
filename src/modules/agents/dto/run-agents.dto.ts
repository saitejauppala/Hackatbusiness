import { IsString, IsNotEmpty } from 'class-validator';

export class RunAgentsDto {
  @IsString()
  @IsNotEmpty()
  routeId: string;
}
