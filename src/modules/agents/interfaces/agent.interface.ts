export interface AgentResult {
  score: number; // 0 to 1
  confidence: number; // 0 to 1
  reason: string;
}

export interface IAgent {
  name: string;
  evaluate(routeData: any, ingestionData: any): Promise<AgentResult>;
}
