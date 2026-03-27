"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DemandAgent_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandAgent = void 0;
const common_1 = require("@nestjs/common");
let DemandAgent = DemandAgent_1 = class DemandAgent {
    constructor() {
        this.name = 'DemandAgent';
        this.logger = new common_1.Logger(DemandAgent_1.name);
    }
    async evaluate(routeData, ingestionData) {
        this.logger.log(`Evaluating demand for route ${routeData?.id || 'unknown'}`);
        const hour = new Date().getHours();
        if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) {
            return { score: 0.7, confidence: 0.8, reason: 'Peak hour high demand trend' };
        }
        else if (hour >= 22 || hour <= 4) {
            return { score: 0.1, confidence: 0.9, reason: 'Off-peak low demand trend' };
        }
        return { score: 0.4, confidence: 0.7, reason: 'Average demand trend' };
    }
};
exports.DemandAgent = DemandAgent;
exports.DemandAgent = DemandAgent = DemandAgent_1 = __decorate([
    (0, common_1.Injectable)()
], DemandAgent);
//# sourceMappingURL=demand.agent.js.map