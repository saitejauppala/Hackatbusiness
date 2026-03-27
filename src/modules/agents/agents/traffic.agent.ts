import { Injectable, Logger } from '@nestjs/common';
import { IAgent, AgentResult } from '../interfaces/agent.interface';

@Injectable()
export class TrafficAgent implements IAgent {
  name = 'TrafficAgent';
  private readonly logger = new Logger(TrafficAgent.name);

  async evaluate(routeData: any, ingestionData: any): Promise<AgentResult> {
    this.logger.log(`Evaluating traffic for route ${routeData?.id || 'unknown'}`);
    
    const trafficData = Array.isArray(ingestionData) 
      ? ingestionData.find(d => d.type === 'traffic')?.value 
      : ingestionData?.traffic;
      
    if (!trafficData) {
      return { score: 0.5, confidence: 0.1, reason: 'Missing traffic data' };
    }

    const dataString = JSON.stringify(trafficData).toLowerCase();
    
    // High congestion → high risk
    if (dataString.includes('high congestion') || dataString.includes('accident') || dataString.includes('standstill')) {
      return { score: 0.95, confidence: 0.9, reason: 'High congestion or accidents detected' };
    } else if (dataString.includes('moderate') || dataString.includes('slow')) {
      return { score: 0.5, confidence: 0.8, reason: 'Moderate traffic congestion' };
    }

    return { score: 0.1, confidence: 0.85, reason: 'Normal traffic flow' };
  }
}
