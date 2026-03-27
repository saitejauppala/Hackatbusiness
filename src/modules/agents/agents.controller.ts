import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { RunAgentsDto } from './dto/run-agents.dto';

@Controller('agents')
export class AgentsController {
  private readonly logger = new Logger(AgentsController.name);

  constructor(private readonly agentsService: AgentsService) {}

  @Post('run')
  async run(@Body() runAgentsDto: RunAgentsDto) {
    this.logger.log(`Received agent run request for route ${runAgentsDto.routeId}`);
    return this.agentsService.runAgents(runAgentsDto.routeId);
  }
}
