import { DecisionService } from './decision.service';
import { ExecuteDecisionDto } from './dto/execute-decision.dto';
export declare class DecisionController {
    private readonly decisionService;
    private readonly logger;
    constructor(decisionService: DecisionService);
    execute(executeDecisionDto: ExecuteDecisionDto): Promise<{
        action: string;
        reason: string;
        timestamp: string;
    }>;
}
