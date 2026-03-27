import { HttpService } from '@nestjs/axios';
import { IngestionRepository } from './ingestion.repository';
import { IngestionResponseDto } from './dto/ingestion-response.dto';
export declare class IngestionService {
    private readonly httpService;
    private readonly ingestionRepository;
    private readonly logger;
    constructor(httpService: HttpService, ingestionRepository: IngestionRepository);
    fetchAndProcessAll(): Promise<IngestionResponseDto[]>;
    fetchWithRetry(type: string, url: string, retries?: number): Promise<IngestionResponseDto>;
    private processData;
    getHistory(): Promise<{
        value: import("@prisma/client/runtime/library").JsonValue;
        type: string;
        source: string;
        id: string;
        timestamp: Date;
    }[]>;
}
