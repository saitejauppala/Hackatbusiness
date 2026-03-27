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
var OptimizationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const risk_service_1 = require("../risk/risk.service");
let OptimizationService = OptimizationService_1 = class OptimizationService {
    constructor(prisma, riskService) {
        this.prisma = prisma;
        this.riskService = riskService;
        this.logger = new common_1.Logger(OptimizationService_1.name);
    }
    async optimizeRoute(source, destination) {
        this.logger.log(`Optimizing route logically from ${source} to ${destination}`);
        if (source === destination) {
            throw new common_1.BadRequestException('Source and destination cannot be the same');
        }
        let dbRoutes = [];
        try {
            dbRoutes = await this.prisma.route.findMany();
        }
        catch (error) {
            this.logger.error(`Database error fetching structural routes: ${error.message} (Falling back to mock network)`);
        }
        if (dbRoutes.length === 0) {
            this.logger.warn('Leveraging fallback topology mock to ascertain algorithm safety without seed data');
            dbRoutes = [
                { id: '1', source: 'A', destination: 'B', distance: 10, baseCost: 50 },
                { id: '2', source: 'B', destination: 'C', distance: 20, baseCost: 100 },
                { id: '3', source: 'A', destination: 'C', distance: 50, baseCost: 200 },
                { id: '4', source: 'C', destination: 'D', distance: 5, baseCost: 10 },
            ];
        }
        const graph = {};
        const routeRisks = await Promise.all(dbRoutes.map(async (r) => {
            const riskData = await this.riskService.calculateRisk(r.id);
            return { id: r.id, finalRisk: riskData.finalRisk };
        }));
        const riskMap = Object.fromEntries(routeRisks.map(r => [r.id, r.finalRisk]));
        for (const route of dbRoutes) {
            if (!graph[route.source])
                graph[route.source] = {};
            const time = route.distance;
            const cost = route.baseCost;
            const risk = riskMap[route.id] || 0.1;
            const weight = time + cost + (risk * 10);
            graph[route.source][route.destination] = {
                routeId: route.id,
                weight,
                cost,
                time,
                risk,
            };
        }
        const unvisited = new Set();
        for (const s of Object.keys(graph)) {
            unvisited.add(s);
            for (const d of Object.keys(graph[s]))
                unvisited.add(d);
        }
        if (!unvisited.has(source) || !unvisited.has(destination)) {
            throw new common_1.BadRequestException('Invalid node: specified source or destination topology node does not exist');
        }
        const distances = {};
        const previous = {};
        const edgeData = {};
        for (const node of unvisited) {
            distances[node] = Infinity;
            previous[node] = null;
        }
        distances[source] = 0;
        while (unvisited.size > 0) {
            let currentNode = null;
            let minDistance = Infinity;
            for (const node of unvisited) {
                if (distances[node] < minDistance) {
                    minDistance = distances[node];
                    currentNode = node;
                }
            }
            if (currentNode === null)
                break;
            if (currentNode === destination)
                break;
            unvisited.delete(currentNode);
            if (graph[currentNode]) {
                for (const neighbor in graph[currentNode]) {
                    if (!unvisited.has(neighbor))
                        continue;
                    const edge = graph[currentNode][neighbor];
                    const altDistance = distances[currentNode] + edge.weight;
                    if (altDistance < distances[neighbor]) {
                        distances[neighbor] = altDistance;
                        previous[neighbor] = currentNode;
                        edgeData[neighbor] = edge;
                    }
                }
            }
        }
        const path = [];
        let curr = destination;
        if (previous[destination] === null || distances[destination] === Infinity) {
            throw new common_1.NotFoundException(`No geographical/logical path is available structurally from ${source} to ${destination}`);
        }
        let totalCost = 0;
        let totalTime = 0;
        let totalRisk = 0;
        while (curr !== null) {
            path.unshift(curr);
            if (curr !== source && edgeData[curr]) {
                totalCost += edgeData[curr].cost;
                totalTime += edgeData[curr].time;
                totalRisk += edgeData[curr].risk;
            }
            curr = previous[curr];
        }
        return {
            path,
            totalCost,
            totalTime,
            totalRisk,
        };
    }
};
exports.OptimizationService = OptimizationService;
exports.OptimizationService = OptimizationService = OptimizationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        risk_service_1.RiskService])
], OptimizationService);
//# sourceMappingURL=optimization.service.js.map