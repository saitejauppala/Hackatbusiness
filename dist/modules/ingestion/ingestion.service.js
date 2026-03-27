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
var IngestionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const ingestion_repository_1 = require("./ingestion.repository");
const crypto = require("crypto");
let IngestionService = IngestionService_1 = class IngestionService {
    constructor(httpService, ingestionRepository) {
        this.httpService = httpService;
        this.ingestionRepository = ingestionRepository;
        this.logger = new common_1.Logger(IngestionService_1.name);
    }
    async fetchAndProcessAll() {
        const fetchers = [
            this.fetchWithRetry('weather', 'https://mock-weather-api.example.com/data'),
            this.fetchWithRetry('news', 'https://mock-news-api.example.com/data'),
            this.fetchWithRetry('traffic', 'https://mock-traffic-api.example.com/data'),
        ];
        const results = await Promise.all(fetchers);
        return results.filter((res) => res !== null);
    }
    async fetchWithRetry(type, url, retries = 3) {
        let attempt = 0;
        let delay = 1000;
        while (attempt < retries) {
            try {
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { timeout: 5000 }));
                const value = response?.data || { status: 'ok', mocked: true, data: `Mock data for ${type} (Attempt ${attempt + 1})` };
                this.logger.log(`Successfully fetched ${type} data from ${url}`);
                return await this.processData(type, url, value);
            }
            catch (error) {
                attempt++;
                this.logger.warn(`Failed to fetch ${type} data from ${url}. Attempt ${attempt} of ${retries}. Error: ${error.message}`);
                if (attempt >= retries) {
                    this.logger.error(`Max retries reached for ${type} at ${url}. Returning fallback data.`);
                    return await this.processData(type, url, { status: 'fallback', error: true, data: `Fallback data for ${type}` });
                }
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2;
            }
        }
        return await this.processData(type, url, { status: 'fallback', data: `Ultimate fallback for ${type}` });
    }
    async processData(type, url, rawData) {
        const value = rawData || {};
        const timestamp = new Date();
        const hashContent = JSON.stringify({ type, source: url, value });
        const hash = crypto.createHash('sha256').update(hashContent).digest('hex');
        const normalizedData = {
            source: url,
            type,
            value,
            timestamp,
            hash,
        };
        await this.ingestionRepository.save(normalizedData);
        return {
            source: normalizedData.source,
            type: normalizedData.type,
            value: normalizedData.value,
            timestamp: normalizedData.timestamp,
        };
    }
    async getHistory() {
        return this.ingestionRepository.getHistory(50);
    }
};
exports.IngestionService = IngestionService;
exports.IngestionService = IngestionService = IngestionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        ingestion_repository_1.IngestionRepository])
], IngestionService);
//# sourceMappingURL=ingestion.service.js.map