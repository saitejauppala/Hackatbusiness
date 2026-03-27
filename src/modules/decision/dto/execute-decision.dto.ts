import { IsString, IsNotEmpty } from 'class-validator';

export class ExecuteDecisionDto {
  @IsString()
  @IsNotEmpty()
  routeId: string;
}
