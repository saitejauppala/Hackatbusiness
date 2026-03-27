"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NewsAgent_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsAgent = void 0;
const common_1 = require("@nestjs/common");
let NewsAgent = NewsAgent_1 = class NewsAgent {
    constructor() {
        this.name = 'NewsAgent';
        this.logger = new common_1.Logger(NewsAgent_1.name);
    }
    async evaluate(routeData, ingestionData) {
        this.logger.log(`Evaluating news for route ${routeData?.id || 'unknown'}`);
        const newsData = Array.isArray(ingestionData)
            ? ingestionData.find(d => d.type === 'news')?.value
            : ingestionData?.news;
        if (!newsData) {
            return { score: 0.2, confidence: 0.1, reason: 'Missing news data' };
        }
        const dataString = JSON.stringify(newsData).toLowerCase();
        const riskKeywords = ['war', 'strike', 'protest', 'conflict'];
        const matchedKeywords = riskKeywords.filter(kw => dataString.includes(kw));
        if (matchedKeywords.length > 0) {
            return {
                score: 0.85,
                confidence: 0.8,
                reason: `High risk news detected matching keywords: ${matchedKeywords.join(', ')}`
            };
        }
        return { score: 0.1, confidence: 0.7, reason: 'No concerning news keywords matched' };
    }
};
exports.NewsAgent = NewsAgent;
exports.NewsAgent = NewsAgent = NewsAgent_1 = __decorate([
    (0, common_1.Injectable)()
], NewsAgent);
//# sourceMappingURL=news.agent.js.map