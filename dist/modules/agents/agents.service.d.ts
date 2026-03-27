import { PrismaService } from '../../prisma/prisma.service';
import { IngestionService } from '../ingestion/ingestion.service';
import { WeatherAgent } from './agents/weather.agent';
import { TrafficAgent } from './agents/traffic.agent';
import { NewsAgent } from './agents/news.agent';
import { DemandAgent } from './agents/demand.agent';
export declare class AgentsService {
    private readonly prisma;
    private readonly ingestionService;
    private readonly weatherAgent;
    private readonly trafficAgent;
    private readonly newsAgent;
    private readonly demandAgent;
    private readonly logger;
    constructor(prisma: PrismaService, ingestionService: IngestionService, weatherAgent: WeatherAgent, trafficAgent: TrafficAgent, newsAgent: NewsAgent, demandAgent: DemandAgent);
    runAgents(routeId: string): Promise<{
        routeId: string;
        agentResults: Record<string, any>;
    }>;
}
