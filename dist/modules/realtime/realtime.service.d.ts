import { RealtimeGateway } from './realtime.gateway';
export declare class RealtimeService {
    private readonly realtimeGateway;
    private readonly logger;
    constructor(realtimeGateway: RealtimeGateway);
    broadcastRiskUpdate(payload: any): void;
    broadcastAlert(payload: any): void;
    broadcastRouteChange(payload: any): void;
}
