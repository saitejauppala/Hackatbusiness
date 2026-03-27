import { Module } from '@nestjs/common';
import { RiskModule } from '../risk/risk.module';
import { OptimizationController } from './optimization.controller';
import { OptimizationService } from './optimization.service';

@Module({
  imports: [RiskModule],
  controllers: [OptimizationController],
  providers: [OptimizationService],
})
export class OptimizationModule {}
