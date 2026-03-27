import { Injectable, Logger } from '@nestjs/common';
import { AgentsService } from '../agents/agents.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RiskService {
  private readonly logger = new Logger(RiskService.name);

  constructor(
    private readonly agentsService: AgentsService,
    private readonly prisma: PrismaService,
  ) {}

  async calculateRisk(routeId: string) {
    this.logger.log(`Calculating risk for route: ${routeId}`);
    
    // 1. Fetch agent outputs
    const { agentResults } = await this.agentsService.runAgents(routeId);

    // 2. Parse scores from agentResults securely (handle missing/invalid)
    const getSafeScore = (agentName: string): number => {
      const data = agentResults[agentName];
      if (!data || typeof data.score !== 'number' || isNaN(data.score)) {
        return 0.5; // Default safe fallback
      }
      return data.score;
    };

    const weatherScore = getSafeScore('WeatherAgent');
    const trafficScore = getSafeScore('TrafficAgent');
    const newsScore = getSafeScore('NewsAgent');
    const demandScore = getSafeScore('DemandAgent');

    // 3. Compute weighted risk
    // weather*0.3 + traffic*0.2 + news*0.3 + demand*0.2
    let finalRisk = (weatherScore * 0.3) + (trafficScore * 0.2) + (newsScore * 0.3) + (demandScore * 0.2);
    // Boundary check just in case
    finalRisk = Math.min(Math.max(finalRisk, 0), 1);

    // 4. Delay Probability
    // Simple logic correlating to final risk
    const delayProbability = Math.min(Math.max(finalRisk * 1.2, 0), 1);

    // 5. Risk Levels
    // 0–0.3 → LOW, 0.3–0.6 → MEDIUM, 0.6–0.8 → HIGH, > 0.8 → CRITICAL
    let riskLevel = 'LOW';
    if (finalRisk > 0.8) riskLevel = 'CRITICAL';
    else if (finalRisk > 0.6) riskLevel = 'HIGH';
    else if (finalRisk > 0.3) riskLevel = 'MEDIUM';

    // 6. Explanation (Highest contributing factor)
    const contributions = [
      { name: 'Weather', val: weatherScore * 0.3, raw: weatherScore, reason: agentResults['WeatherAgent']?.reason },
      { name: 'Traffic', val: trafficScore * 0.2, raw: trafficScore, reason: agentResults['TrafficAgent']?.reason },
      { name: 'News', val: newsScore * 0.3, raw: newsScore, reason: agentResults['NewsAgent']?.reason },
      { name: 'Demand', val: demandScore * 0.2, raw: demandScore, reason: agentResults['DemandAgent']?.reason },
    ];

    const highestContributor = contributions.reduce((prev, current) => (prev.val > current.val) ? prev : current);
    
    const explanation = `Risk is ${riskLevel} dynamically tied to ${highestContributor.name}. Reason: ${highestContributor.reason || 'Unknown factor'}`;

    // 7. Store results in DB securely
    try {
      await this.prisma.risk.create({
        data: {
          routeId: routeId,
          weather: JSON.stringify(agentResults['WeatherAgent'] || {}),
          traffic: JSON.stringify(agentResults['TrafficAgent'] || {}),
          news: JSON.stringify(agentResults['NewsAgent'] || {}),
          demand: JSON.stringify(agentResults['DemandAgent'] || {}),
          finalScore: finalRisk,
        }
      });
    } catch (error) {
      this.logger.error(`Database error while saving risk data for route ${routeId}: ${error.message} (Possibly invalid routeId foreign key, ignoring)`);
    }

    // 8. Output structured evaluation
    return {
      finalRisk,
      delayProbability,
      riskLevel,
      explanation
    };
  }
}
