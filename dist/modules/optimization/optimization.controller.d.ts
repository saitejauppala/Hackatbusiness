import { OptimizationService } from './optimization.service';
import { OptimizeDto } from './dto/optimize.dto';
export declare class OptimizationController {
    private readonly optimizationService;
    private readonly logger;
    constructor(optimizationService: OptimizationService);
    optimize(optimizeDto: OptimizeDto): Promise<{
        path: string[];
        totalCost: number;
        totalTime: number;
        totalRisk: number;
    }>;
}
