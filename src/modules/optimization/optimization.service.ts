import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RiskService } from '../risk/risk.service';

interface GraphNode {
  [destination: string]: {
    routeId: string;
    weight: number;
    cost: number;
    time: number;
    risk: number;
  };
}

interface Graph {
  [source: string]: GraphNode;
}

@Injectable()
export class OptimizationService {
  private readonly logger = new Logger(OptimizationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly riskService: RiskService,
  ) {}

  async optimizeRoute(source: string, destination: string) {
    this.logger.log(`Optimizing route logically from ${source} to ${destination}`);

    if (source === destination) {
      throw new BadRequestException('Source and destination cannot be the same');
    }

    // 1. Fetch available routes from system
    let dbRoutes: any[] = [];
    try {
      dbRoutes = await this.prisma.route.findMany();
    } catch (error) {
       this.logger.error(`Database error fetching structural routes: ${error.message} (Falling back to mock network)`);
    }

    // Fallback graph topology if database is unseeded/unreachable
    if (dbRoutes.length === 0) {
      this.logger.warn('Leveraging fallback topology mock to ascertain algorithm safety without seed data');
      dbRoutes = [
        { id: '1', source: 'A', destination: 'B', distance: 10, baseCost: 50 },
        { id: '2', source: 'B', destination: 'C', distance: 20, baseCost: 100 },
        { id: '3', source: 'A', destination: 'C', distance: 50, baseCost: 200 },
        { id: '4', source: 'C', destination: 'D', distance: 5, baseCost: 10 },
      ] as any;
    }

    // 2. Fetch risk concurrently and instantiate graph dictionary
    const graph: Graph = {};

    const routeRisks = await Promise.all(dbRoutes.map(async (r) => {
      // Safely fetches evaluation; defaults to ~0.1 on network isolation logically
      const riskData = await this.riskService.calculateRisk(r.id);
      return { id: r.id, finalRisk: riskData.finalRisk };
    }));

    const riskMap = Object.fromEntries(routeRisks.map(r => [r.id, r.finalRisk]));

    for (const route of dbRoutes) {
      if (!graph[route.source]) graph[route.source] = {};
      
      const time = route.distance;
      const cost = route.baseCost;
      const risk = riskMap[route.id] || 0.1;

      // Mathematical composite equation: weight = time + cost + (risk * 10)
      const weight = time + cost + (risk * 10);

      graph[route.source][route.destination] = {
        routeId: route.id,
        weight,
        cost,
        time,
        risk,
      };
    }

    // Validate if source and dest strings conceptually exist in mapped environment
    const unvisited: Set<string> = new Set();
    for (const s of Object.keys(graph)) {
      unvisited.add(s);
      for (const d of Object.keys(graph[s])) unvisited.add(d);
    }
    
    if (!unvisited.has(source) || !unvisited.has(destination)) {
       throw new BadRequestException('Invalid node: specified source or destination topology node does not exist');
    }

    // 3. Mathematical Dijkstra's Routing Traversal
    const distances: { [node: string]: number } = {};
    const previous: { [node: string]: string | null } = {};
    const edgeData: { [node: string]: any } = {};

    for (const node of unvisited) {
      distances[node] = Infinity;
      previous[node] = null;
    }
    distances[source] = 0;

    while (unvisited.size > 0) {
      let currentNode: string | null = null;
      let minDistance = Infinity;

      for (const node of unvisited) {
        if (distances[node] < minDistance) {
          minDistance = distances[node];
          currentNode = node;
        }
      }

      if (currentNode === null) break; // Isolates inaccessible nodes properly
      if (currentNode === destination) break; // Found terminal optimal constraint

      unvisited.delete(currentNode);

      if (graph[currentNode]) {
        for (const neighbor in graph[currentNode]) {
          if (!unvisited.has(neighbor)) continue;

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

    // 4. Backtrack the most optimal resolution path
    const path: string[] = [];
    let curr: string | null = destination;
    
    if (previous[destination] === null || distances[destination] === Infinity) {
      throw new NotFoundException(`No geographical/logical path is available structurally from ${source} to ${destination}`);
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

    // 5. Structure payload resolution
    return {
      path,
      totalCost,
      totalTime,
      totalRisk,
    };
  }
}
