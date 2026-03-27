import { Injectable, Logger } from '@nestjs/common';
import { IAgent, AgentResult } from '../interfaces/agent.interface';

@Injectable()
export class WeatherAgent implements IAgent {
  name = 'WeatherAgent';
  private readonly logger = new Logger(WeatherAgent.name);

  async evaluate(routeData: any, ingestionData: any): Promise<AgentResult> {
    this.logger.log(`Evaluating weather for route ${routeData?.id || 'unknown'}`);
    
    // Extract weather data from ingestion array or object
    const weatherData = Array.isArray(ingestionData) 
      ? ingestionData.find(d => d.type === 'weather')?.value 
      : ingestionData?.weather;
      
    // Default safe values
    if (!weatherData) {
      this.logger.warn('No weather data found, using default safe values');
      return { score: 0.1, confidence: 0.1, reason: 'Missing weather data' };
    }

    const dataString = JSON.stringify(weatherData).toLowerCase();
    
    // High rain/storm → high risk
    if (dataString.includes('storm') || dataString.includes('heavy rain') || dataString.includes('hurricane')) {
      return { score: 0.9, confidence: 0.85, reason: 'Severe weather conditions (storm/heavy rain) detected' };
    } else if (dataString.includes('rain') || dataString.includes('snow')) {
      return { score: 0.6, confidence: 0.8, reason: 'Moderate weather conditions (rain/snow) detected' };
    }

    return { score: 0.1, confidence: 0.9, reason: 'Clear weather conditions' };
  }
}
