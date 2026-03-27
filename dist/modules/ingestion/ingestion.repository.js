"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var IngestionRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let IngestionRepository = IngestionRepository_1 = class IngestionRepository {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(IngestionRepository_1.name);
    }
    async save(data) {
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
        }
        catch (error) {
            if (error?.code === 'P2002') {
                return null;
            }
            this.logger.error(`Database error during save: ${error.message}`);
            return null;
        }
    }
    async getHistory(limit = 50) {
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
        }
        catch (error) {
            this.logger.error(`Database error during getHistory: ${error.message}`);
            return [];
        }
    }
};
exports.IngestionRepository = IngestionRepository;
exports.IngestionRepository = IngestionRepository = IngestionRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IngestionRepository);
//# sourceMappingURL=ingestion.repository.js.map