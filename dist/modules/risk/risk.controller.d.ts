import { RiskService } from './risk.service';
export declare class RiskController {
    private readonly riskService;
    private readonly logger;
    constructor(riskService: RiskService);
    getRisk(routeId: string): Promise<{
        finalRisk: number;
        delayProbability: number;
        riskLevel: string;
        explanation: string;
    }>;
}
