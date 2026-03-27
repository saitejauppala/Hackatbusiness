import { Injectable, Logger } from '@nestjs/common';
import { IAgent, AgentResult } from '../interfaces/agent.interface';

@Injectable()
export class DemandAgent implements IAgent {
  name = 'DemandAgent';
  private readonly logger = new Logger(DemandAgent.name);

  async evaluate(routeData: any, ingestionData: any): Promise<AgentResult> {
    this.logger.log(`Evaluating demand for route ${routeData?.id || 'unknown'}`);
    
    // Demand agent evaluates simple trend logic. 
    // Here we simulate a trend based on day of week / time
    const hour = new Date().getHours();
    
    // High demand during rush hours
    if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) {
      return { score: 0.7, confidence: 0.8, reason: 'Peak hour high demand trend' };
    } else if (hour >= 22 || hour <= 4) {
      return { score: 0.1, confidence: 0.9, reason: 'Off-peak low demand trend' };
    }

    return { score: 0.4, confidence: 0.7, reason: 'Average demand trend' };
  }
}
