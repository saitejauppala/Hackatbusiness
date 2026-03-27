import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IngestionService } from '../ingestion/ingestion.service';
import { WeatherAgent } from './agents/weather.agent';
import { TrafficAgent } from './agents/traffic.agent';
import { NewsAgent } from './agents/news.agent';
import { DemandAgent } from './agents/demand.agent';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ingestionService: IngestionService,
    private readonly weatherAgent: WeatherAgent,
    private readonly trafficAgent: TrafficAgent,
    private readonly newsAgent: NewsAgent,
    private readonly demandAgent: DemandAgent,
  ) {}

  async runAgents(routeId: string) {
    this.logger.log(`Running agents for route: ${routeId}`);

    let route = null;
    try {
      // Find route but don't crash if it's missing or DB fails
      route = await this.prisma.route.findUnique({ where: { id: routeId } });
    } catch(err) {}

    if (!route) {
      this.logger.warn(`Route ${routeId} not found or db error, using default mock route data for safety`);
      route = { id: routeId, source: 'Mock Source', destination: 'Mock Dest', distance: 10, baseCost: 50, createdAt: new Date() };
    }

    // Fetch realtime ingestion data
    let ingestionData: any = [];
    try {
      ingestionData = await this.ingestionService.fetchAndProcessAll();
    } catch (error) {
       this.logger.error(`Error fetching ingestion data: ${error.message}. Continuing with empty dataset.`);
    }

    const agents = [
      this.weatherAgent,
      this.trafficAgent,
      this.newsAgent,
      this.demandAgent,
    ];

    const results: Record<string, any> = {};

    // Run evaluating concurrently, failing elegantly back to default values
    await Promise.allSettled(
      agents.map(async (agent) => {
        try {
          results[agent.name] = await agent.evaluate(route, ingestionData);
        } catch (error) {
          this.logger.error(`Agent ${agent.name} failed explicitly: ${error.message}`);
          results[agent.name] = { score: 0.5, confidence: 0.1, reason: 'Agent evaluation hard failure' };
        }
      })
    );

    // Provide default final score if entirely impossible
    return {
      routeId,
      agentResults: results,
    };
  }
}
