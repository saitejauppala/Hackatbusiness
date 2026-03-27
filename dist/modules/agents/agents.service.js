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
var AgentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const ingestion_service_1 = require("../ingestion/ingestion.service");
const weather_agent_1 = require("./agents/weather.agent");
const traffic_agent_1 = require("./agents/traffic.agent");
const news_agent_1 = require("./agents/news.agent");
const demand_agent_1 = require("./agents/demand.agent");
let AgentsService = AgentsService_1 = class AgentsService {
    constructor(prisma, ingestionService, weatherAgent, trafficAgent, newsAgent, demandAgent) {
        this.prisma = prisma;
        this.ingestionService = ingestionService;
        this.weatherAgent = weatherAgent;
        this.trafficAgent = trafficAgent;
        this.newsAgent = newsAgent;
        this.demandAgent = demandAgent;
        this.logger = new common_1.Logger(AgentsService_1.name);
    }
    async runAgents(routeId) {
        this.logger.log(`Running agents for route: ${routeId}`);
        let route = null;
        try {
            route = await this.prisma.route.findUnique({ where: { id: routeId } });
        }
        catch (err) { }
        if (!route) {
            this.logger.warn(`Route ${routeId} not found or db error, using default mock route data for safety`);
            route = { id: routeId, source: 'Mock Source', destination: 'Mock Dest', distance: 10, baseCost: 50, createdAt: new Date() };
        }
        let ingestionData = [];
        try {
            ingestionData = await this.ingestionService.fetchAndProcessAll();
        }
        catch (error) {
            this.logger.error(`Error fetching ingestion data: ${error.message}. Continuing with empty dataset.`);
        }
        const agents = [
            this.weatherAgent,
            this.trafficAgent,
            this.newsAgent,
            this.demandAgent,
        ];
        const results = {};
        await Promise.allSettled(agents.map(async (agent) => {
            try {
                results[agent.name] = await agent.evaluate(route, ingestionData);
            }
            catch (error) {
                this.logger.error(`Agent ${agent.name} failed explicitly: ${error.message}`);
                results[agent.name] = { score: 0.5, confidence: 0.1, reason: 'Agent evaluation hard failure' };
            }
        }));
        return {
            routeId,
            agentResults: results,
        };
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = AgentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ingestion_service_1.IngestionService,
        weather_agent_1.WeatherAgent,
        traffic_agent_1.TrafficAgent,
        news_agent_1.NewsAgent,
        demand_agent_1.DemandAgent])
], AgentsService);
//# sourceMappingURL=agents.service.js.map