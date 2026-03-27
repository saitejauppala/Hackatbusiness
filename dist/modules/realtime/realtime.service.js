"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RealtimeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeService = void 0;
const common_1 = require("@nestjs/common");
const realtime_gateway_1 = require("./realtime.gateway");
let RealtimeService = RealtimeService_1 = class RealtimeService {
    constructor(realtimeGateway) {
        this.realtimeGateway = realtimeGateway;
        this.logger = new common_1.Logger(RealtimeService_1.name);
    }
    broadcastRiskUpdate(payload) {
        this.logger.log('Interposed request to broadcast risk_update event dynamically');
        this.realtimeGateway.emitRiskUpdate(payload);
    }
    broadcastAlert(payload) {
        this.logger.log('Interposed request to broadcast alert event dynamically');
        this.realtimeGateway.emitAlert(payload);
    }
    broadcastRouteChange(payload) {
        this.logger.log('Interposed request to broadcast route_change event dynamically');
        this.realtimeGateway.emitRouteChange(payload);
    }
};
exports.RealtimeService = RealtimeService;
exports.RealtimeService = RealtimeService = RealtimeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [realtime_gateway_1.RealtimeGateway])
], RealtimeService);
//# sourceMappingURL=realtime.service.js.map