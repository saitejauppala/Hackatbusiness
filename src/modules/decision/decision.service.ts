import { Injectable, Logger } from '@nestjs/common';
import { RiskService } from '../risk/risk.service';

@Injectable()
export class DecisionService {
  private readonly logger = new Logger(DecisionService.name);

  constructor(private readonly riskService: RiskService) {}

  async executeDecision(routeId: string) {
    this.logger.log(`Executing autonomous decision mapping for route ${routeId}`);

    // Fetch overarching computational risk dynamically and deterministically
    const riskProfile = await this.riskService.calculateRisk(routeId);
    const risk = riskProfile.finalRisk;
    
    let action = 'CONTINUE';
    let reason = 'Risk is within acceptable bounds';

    if (risk > 0.7) {
      action = 'REROUTE';
      reason = `Critical risk profile exceeded safety threshold (Risk: ${risk.toFixed(2)} - ${riskProfile.explanation})`;
    } else if (risk >= 0.4) {
      action = 'ALERT';
      reason = `Elevated risk detected, precaution advised (Risk: ${risk.toFixed(2)} - ${riskProfile.explanation})`;
    } else {
      reason = `Safe to proceed inherently (Risk: ${risk.toFixed(2)} - ${riskProfile.explanation})`;
    }

    const timestamp = new Date().toISOString();

    const decisionRecord = {
      action,
      reason,
      timestamp,
    };

    this.logger.log(`Action evaluated securely for route ${routeId}: ${action}`);

    return decisionRecord;
  }
}
