import { Controller, Post, Body, Logger } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { ExecuteDecisionDto } from './dto/execute-decision.dto';

@Controller('decision')
export class DecisionController {
  private readonly logger = new Logger(DecisionController.name);

  constructor(private readonly decisionService: DecisionService) {}

  @Post('execute')
  async execute(@Body() executeDecisionDto: ExecuteDecisionDto) {
    this.logger.log(`Decision execution API breached logically for routing identifier ${executeDecisionDto.routeId}`);
    return this.decisionService.executeDecision(executeDecisionDto.routeId);
  }
}
