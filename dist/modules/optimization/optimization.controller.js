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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OptimizationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizationController = void 0;
const common_1 = require("@nestjs/common");
const optimization_service_1 = require("./optimization.service");
const optimize_dto_1 = require("./dto/optimize.dto");
let OptimizationController = OptimizationController_1 = class OptimizationController {
    constructor(optimizationService) {
        this.optimizationService = optimizationService;
        this.logger = new common_1.Logger(OptimizationController_1.name);
    }
    async optimize(optimizeDto) {
        this.logger.log(`POST /optimize resolving algorithmic path from ${optimizeDto.source} -> ${optimizeDto.destination}`);
        return this.optimizationService.optimizeRoute(optimizeDto.source, optimizeDto.destination);
    }
};
exports.OptimizationController = OptimizationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [optimize_dto_1.OptimizeDto]),
    __metadata("design:returntype", Promise)
], OptimizationController.prototype, "optimize", null);
exports.OptimizationController = OptimizationController = OptimizationController_1 = __decorate([
    (0, common_1.Controller)('optimize'),
    __metadata("design:paramtypes", [optimization_service_1.OptimizationService])
], OptimizationController);
//# sourceMappingURL=optimization.controller.js.map