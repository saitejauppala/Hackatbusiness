import { AgentsService } from '../agents/agents.service';
import { PrismaService } from '../../prisma/prisma.service';
export declare class RiskService {
    private readonly agentsService;
    private readonly prisma;
    private readonly logger;
    constructor(agentsService: AgentsService, prisma: PrismaService);
    calculateRisk(routeId: string): Promise<{
        finalRisk: number;
        delayProbability: number;
        riskLevel: string;
        explanation: string;
    }>;
}
