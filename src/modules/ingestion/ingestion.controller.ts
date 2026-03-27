import { Controller, Get, Logger } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  private readonly logger = new Logger(IngestionController.name);

  constructor(private readonly ingestionService: IngestionService) {}

  @Get('live')
  async getLive() {
    this.logger.log('Fetching live ingestion data...');
    return this.ingestionService.fetchAndProcessAll();
  }

  @Get('history')
  async getHistory() {
    this.logger.log('Fetching historical ingestion data (last 50 max)...');
    return this.ingestionService.getHistory();
  }
}
