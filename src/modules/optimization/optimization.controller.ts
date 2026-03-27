import { Controller, Post, Body, Logger } from '@nestjs/common';
import { OptimizationService } from './optimization.service';
import { OptimizeDto } from './dto/optimize.dto';

@Controller('optimize')
export class OptimizationController {
  private readonly logger = new Logger(OptimizationController.name);

  constructor(private readonly optimizationService: OptimizationService) {}

  @Post()
  async optimize(@Body() optimizeDto: OptimizeDto) {
    this.logger.log(`POST /optimize resolving algorithmic path from ${optimizeDto.source} -> ${optimizeDto.destination}`);
    return this.optimizationService.optimizeRoute(optimizeDto.source, optimizeDto.destination);
  }
}
