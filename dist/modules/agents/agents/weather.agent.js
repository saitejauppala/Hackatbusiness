"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WeatherAgent_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherAgent = void 0;
const common_1 = require("@nestjs/common");
let WeatherAgent = WeatherAgent_1 = class WeatherAgent {
    constructor() {
        this.name = 'WeatherAgent';
        this.logger = new common_1.Logger(WeatherAgent_1.name);
    }
    async evaluate(routeData, ingestionData) {
        this.logger.log(`Evaluating weather for route ${routeData?.id || 'unknown'}`);
        const weatherData = Array.isArray(ingestionData)
            ? ingestionData.find(d => d.type === 'weather')?.value
            : ingestionData?.weather;
        if (!weatherData) {
            this.logger.warn('No weather data found, using default safe values');
            return { score: 0.1, confidence: 0.1, reason: 'Missing weather data' };
        }
        const dataString = JSON.stringify(weatherData).toLowerCase();
        if (dataString.includes('storm') || dataString.includes('heavy rain') || dataString.includes('hurricane')) {
            return { score: 0.9, confidence: 0.85, reason: 'Severe weather conditions (storm/heavy rain) detected' };
        }
        else if (dataString.includes('rain') || dataString.includes('snow')) {
            return { score: 0.6, confidence: 0.8, reason: 'Moderate weather conditions (rain/snow) detected' };
        }
        return { score: 0.1, confidence: 0.9, reason: 'Clear weather conditions' };
    }
};
exports.WeatherAgent = WeatherAgent;
exports.WeatherAgent = WeatherAgent = WeatherAgent_1 = __decorate([
    (0, common_1.Injectable)()
], WeatherAgent);
//# sourceMappingURL=weather.agent.js.map