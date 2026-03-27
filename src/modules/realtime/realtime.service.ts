import { Injectable, Logger } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';

@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);

  constructor(private readonly realtimeGateway: RealtimeGateway) {}

  broadcastRiskUpdate(payload: any) {
    this.logger.log('Interposed request to broadcast risk_update event dynamically');
    this.realtimeGateway.emitRiskUpdate(payload);
  }

  broadcastAlert(payload: any) {
    this.logger.log('Interposed request to broadcast alert event dynamically');
    this.realtimeGateway.emitAlert(payload);
  }

  broadcastRouteChange(payload: any) {
    this.logger.log('Interposed request to broadcast route_change event dynamically');
    this.realtimeGateway.emitRouteChange(payload);
  }
}
