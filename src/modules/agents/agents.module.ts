import { Module } from '@nestjs/common';
import { IngestionModule } from '../ingestion/ingestion.module';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { WeatherAgent } from './agents/weather.agent';
import { TrafficAgent } from './agents/traffic.agent';
import { NewsAgent } from './agents/news.agent';
import { DemandAgent } from './agents/demand.agent';

@Module({
  imports: [IngestionModule],
  controllers: [AgentsController],
  providers: [
    AgentsService,
    WeatherAgent,
    TrafficAgent,
    NewsAgent,
    DemandAgent,
  ],
  exports: [AgentsService],
})
export class AgentsModule {}
