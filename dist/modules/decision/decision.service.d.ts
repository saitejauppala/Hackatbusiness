import { RiskService } from '../risk/risk.service';
export declare class DecisionService {
    private readonly riskService;
    private readonly logger;
    constructor(riskService: RiskService);
    executeDecision(routeId: string): Promise<{
        action: string;
        reason: string;
        timestamp: string;
    }>;
}
