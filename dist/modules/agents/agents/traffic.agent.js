"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TrafficAgent_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficAgent = void 0;
const common_1 = require("@nestjs/common");
let TrafficAgent = TrafficAgent_1 = class TrafficAgent {
    constructor() {
        this.name = 'TrafficAgent';
        this.logger = new common_1.Logger(TrafficAgent_1.name);
    }
    async evaluate(routeData, ingestionData) {
        this.logger.log(`Evaluating traffic for route ${routeData?.id || 'unknown'}`);
        const trafficData = Array.isArray(ingestionData)
            ? ingestionData.find(d => d.type === 'traffic')?.value
            : ingestionData?.traffic;
        if (!trafficData) {
            return { score: 0.5, confidence: 0.1, reason: 'Missing traffic data' };
        }
        const dataString = JSON.stringify(trafficData).toLowerCase();
        if (dataString.includes('high congestion') || dataString.includes('accident') || dataString.includes('standstill')) {
            return { score: 0.95, confidence: 0.9, reason: 'High congestion or accidents detected' };
        }
        else if (dataString.includes('moderate') || dataString.includes('slow')) {
            return { score: 0.5, confidence: 0.8, reason: 'Moderate traffic congestion' };
        }
        return { score: 0.1, confidence: 0.85, reason: 'Normal traffic flow' };
    }
};
exports.TrafficAgent = TrafficAgent;
exports.TrafficAgent = TrafficAgent = TrafficAgent_1 = __decorate([
    (0, common_1.Injectable)()
], TrafficAgent);
//# sourceMappingURL=traffic.agent.js.map