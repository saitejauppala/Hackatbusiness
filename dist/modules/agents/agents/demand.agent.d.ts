import { IAgent, AgentResult } from '../interfaces/agent.interface';
export declare class DemandAgent implements IAgent {
    name: string;
    private readonly logger;
    evaluate(routeData: any, ingestionData: any): Promise<AgentResult>;
}
