import { Module } from '@nestjs/common';
import { RiskModule } from '../risk/risk.module';
import { DecisionController } from './decision.controller';
import { DecisionService } from './decision.service';

@Module({
  imports: [RiskModule],
  controllers: [DecisionController],
  providers: [DecisionService],
})
export class DecisionModule {}
