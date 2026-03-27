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
var DecisionController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionController = void 0;
const common_1 = require("@nestjs/common");
const decision_service_1 = require("./decision.service");
const execute_decision_dto_1 = require("./dto/execute-decision.dto");
let DecisionController = DecisionController_1 = class DecisionController {
    constructor(decisionService) {
        this.decisionService = decisionService;
        this.logger = new common_1.Logger(DecisionController_1.name);
    }
    async execute(executeDecisionDto) {
        this.logger.log(`Decision execution API breached logically for routing identifier ${executeDecisionDto.routeId}`);
        return this.decisionService.executeDecision(executeDecisionDto.routeId);
    }
};
exports.DecisionController = DecisionController;
__decorate([
    (0, common_1.Post)('execute'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [execute_decision_dto_1.ExecuteDecisionDto]),
    __metadata("design:returntype", Promise)
], DecisionController.prototype, "execute", null);
exports.DecisionController = DecisionController = DecisionController_1 = __decorate([
    (0, common_1.Controller)('decision'),
    __metadata("design:paramtypes", [decision_service_1.DecisionService])
], DecisionController);
//# sourceMappingURL=decision.controller.js.map