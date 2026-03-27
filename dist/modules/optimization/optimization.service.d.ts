import { PrismaService } from '../../prisma/prisma.service';
import { RiskService } from '../risk/risk.service';
export declare class OptimizationService {
    private readonly prisma;
    private readonly riskService;
    private readonly logger;
    constructor(prisma: PrismaService, riskService: RiskService);
    optimizeRoute(source: string, destination: string): Promise<{
        path: string[];
        totalCost: number;
        totalTime: number;
        totalRisk: number;
    }>;
}
