import { Injectable, Logger } from '@nestjs/common';
import { IAgent, AgentResult } from '../interfaces/agent.interface';

@Injectable()
export class NewsAgent implements IAgent {
  name = 'NewsAgent';
  private readonly logger = new Logger(NewsAgent.name);

  async evaluate(routeData: any, ingestionData: any): Promise<AgentResult> {
    this.logger.log(`Evaluating news for route ${routeData?.id || 'unknown'}`);
    
    const newsData = Array.isArray(ingestionData) 
      ? ingestionData.find(d => d.type === 'news')?.value 
      : ingestionData?.news;
      
    if (!newsData) {
      return { score: 0.2, confidence: 0.1, reason: 'Missing news data' };
    }

    const dataString = JSON.stringify(newsData).toLowerCase();
    const riskKeywords = ['war', 'strike', 'protest', 'conflict'];
    
    const matchedKeywords = riskKeywords.filter(kw => dataString.includes(kw));

    if (matchedKeywords.length > 0) {
      return { 
        score: 0.85, 
        confidence: 0.8, 
        reason: `High risk news detected matching keywords: ${matchedKeywords.join(', ')}` 
      };
    }

    return { score: 0.1, confidence: 0.7, reason: 'No concerning news keywords matched' };
  }
}
