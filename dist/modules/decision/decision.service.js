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
var DecisionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionService = void 0;
const common_1 = require("@nestjs/common");
const risk_service_1 = require("../risk/risk.service");
let DecisionService = DecisionService_1 = class DecisionService {
    constructor(riskService) {
        this.riskService = riskService;
        this.logger = new common_1.Logger(DecisionService_1.name);
    }
    async executeDecision(routeId) {
        this.logger.log(`Executing autonomous decision mapping for route ${routeId}`);
        const riskProfile = await this.riskService.calculateRisk(routeId);
        const risk = riskProfile.finalRisk;
        let action = 'CONTINUE';
        let reason = 'Risk is within acceptable bounds';
        if (risk > 0.7) {
            action = 'REROUTE';
            reason = `Critical risk profile exceeded safety threshold (Risk: ${risk.toFixed(2)} - ${riskProfile.explanation})`;
        }
        else if (risk >= 0.4) {
            action = 'ALERT';
            reason = `Elevated risk detected, precaution advised (Risk: ${risk.toFixed(2)} - ${riskProfile.explanation})`;
        }
        else {
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
};
exports.DecisionService = DecisionService;
exports.DecisionService = DecisionService = DecisionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [risk_service_1.RiskService])
], DecisionService);
//# sourceMappingURL=decision.service.js.map