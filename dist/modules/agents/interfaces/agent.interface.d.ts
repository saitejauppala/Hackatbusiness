export interface AgentResult {
    score: number;
    confidence: number;
    reason: string;
}
export interface IAgent {
    name: string;
    evaluate(routeData: any, ingestionData: any): Promise<AgentResult>;
}
