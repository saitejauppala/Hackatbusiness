import { AgentsService } from './agents.service';
import { RunAgentsDto } from './dto/run-agents.dto';
export declare class AgentsController {
    private readonly agentsService;
    private readonly logger;
    constructor(agentsService: AgentsService);
    run(runAgentsDto: RunAgentsDto): Promise<{
        routeId: string;
        agentResults: Record<string, any>;
    }>;
}
