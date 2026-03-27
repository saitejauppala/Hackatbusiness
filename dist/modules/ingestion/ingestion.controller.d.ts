import { IngestionService } from './ingestion.service';
export declare class IngestionController {
    private readonly ingestionService;
    private readonly logger;
    constructor(ingestionService: IngestionService);
    getLive(): Promise<import("./dto/ingestion-response.dto").IngestionResponseDto[]>;
    getHistory(): Promise<{
        value: import("@prisma/client/runtime/library").JsonValue;
        type: string;
        source: string;
        id: string;
        timestamp: Date;
    }[]>;
}
