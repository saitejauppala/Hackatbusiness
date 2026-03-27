import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { IngestionRepository } from './ingestion.repository';

@Module({
  imports: [HttpModule],
  controllers: [IngestionController],
  providers: [IngestionService, IngestionRepository],
  exports: [IngestionService, IngestionRepository],
})
export class IngestionModule {}
