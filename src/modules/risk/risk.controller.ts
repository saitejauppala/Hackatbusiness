import { Controller, Get, Param, Logger } from '@nestjs/common';
import { RiskService } from './risk.service';

@Controller('risk')
export class RiskController {
  private readonly logger = new Logger(RiskController.name);

  constructor(private readonly riskService: RiskService) {}

  @Get(':routeId')
  async getRisk(@Param('routeId') routeId: string) {
    this.logger.log(`Received request to evaluate unified risk for route ${routeId}`);
    return this.riskService.calculateRisk(routeId);
  }
}
