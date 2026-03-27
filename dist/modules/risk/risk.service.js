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
var RiskService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskService = void 0;
const common_1 = require("@nestjs/common");
const agents_service_1 = require("../agents/agents.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let RiskService = RiskService_1 = class RiskService {
    constructor(agentsService, prisma) {
        this.agentsService = agentsService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(RiskService_1.name);
    }
    async calculateRisk(routeId) {
        this.logger.log(`Calculating risk for route: ${routeId}`);
        const { agentResults } = await this.agentsService.runAgents(routeId);
        const getSafeScore = (agentName) => {
            const data = agentResults[agentName];
            if (!data || typeof data.score !== 'number' || isNaN(data.score)) {
                return 0.5;
            }
            return data.score;
        };
        const weatherScore = getSafeScore('WeatherAgent');
        const trafficScore = getSafeScore('TrafficAgent');
        const newsScore = getSafeScore('NewsAgent');
        const demandScore = getSafeScore('DemandAgent');
        let finalRisk = (weatherScore * 0.3) + (trafficScore * 0.2) + (newsScore * 0.3) + (demandScore * 0.2);
        finalRisk = Math.min(Math.max(finalRisk, 0), 1);
        const delayProbability = Math.min(Math.max(finalRisk * 1.2, 0), 1);
        let riskLevel = 'LOW';
        if (finalRisk > 0.8)
            riskLevel = 'CRITICAL';
        else if (finalRisk > 0.6)
            riskLevel = 'HIGH';
        else if (finalRisk > 0.3)
            riskLevel = 'MEDIUM';
        const contributions = [
            { name: 'Weather', val: weatherScore * 0.3, raw: weatherScore, reason: agentResults['WeatherAgent']?.reason },
            { name: 'Traffic', val: trafficScore * 0.2, raw: trafficScore, reason: agentResults['TrafficAgent']?.reason },
            { name: 'News', val: newsScore * 0.3, raw: newsScore, reason: agentResults['NewsAgent']?.reason },
            { name: 'Demand', val: demandScore * 0.2, raw: demandScore, reason: agentResults['DemandAgent']?.reason },
        ];
        const highestContributor = contributions.reduce((prev, current) => (prev.val > current.val) ? prev : current);
        const explanation = `Risk is ${riskLevel} dynamically tied to ${highestContributor.name}. Reason: ${highestContributor.reason || 'Unknown factor'}`;
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
        }
        catch (error) {
            this.logger.error(`Database error while saving risk data for route ${routeId}: ${error.message} (Possibly invalid routeId foreign key, ignoring)`);
        }
        return {
            finalRisk,
            delayProbability,
            riskLevel,
            explanation
        };
    }
};
exports.RiskService = RiskService;
exports.RiskService = RiskService = RiskService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agents_service_1.AgentsService,
        prisma_service_1.PrismaService])
], RiskService);
//# sourceMappingURL=risk.service.js.map