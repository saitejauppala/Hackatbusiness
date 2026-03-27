import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IngestionRepository {
  private readonly logger = new Logger(IngestionRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async save(data: { source: string; type: string; value: any; hash: string; timestamp: Date }) {
    try {
      return await this.prisma.ingestionLog.create({
        data: {
          source: data.source,
          type: data.type,
          value: data.value,
          hash: data.hash,
          timestamp: data.timestamp,
        },
      });
    } catch (error) {
      if (error?.code === 'P2002') {
        // Unique constraint failed on hash means duplicate entry. Safe to ignore.
        return null;
      }
      this.logger.error(`Database error during save: ${error.message}`);
      return null;
    }
  }

  async getHistory(limit: number = 50) {
    try {
      return await this.prisma.ingestionLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: limit,
        select: {
          id: true,
          source: true,
          type: true,
          value: true,
          timestamp: true,
        }
      });
    } catch (error) {
      this.logger.error(`Database error during getHistory: ${error.message}`);
      return [];
    }
  }
}
