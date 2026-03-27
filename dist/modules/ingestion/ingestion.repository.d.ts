import { PrismaService } from '../../prisma/prisma.service';
export declare class IngestionRepository {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    save(data: {
        source: string;
        type: string;
        value: any;
        hash: string;
        timestamp: Date;
    }): Promise<{
        value: import("@prisma/client/runtime/library").JsonValue;
        type: string;
        source: string;
        id: string;
        createdAt: Date;
        hash: string;
        timestamp: Date;
    } | null>;
    getHistory(limit?: number): Promise<{
        value: import("@prisma/client/runtime/library").JsonValue;
        type: string;
        source: string;
        id: string;
        timestamp: Date;
    }[]>;
}
