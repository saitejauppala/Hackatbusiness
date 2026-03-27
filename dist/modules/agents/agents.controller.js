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
var AgentsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsController = void 0;
const common_1 = require("@nestjs/common");
const agents_service_1 = require("./agents.service");
const run_agents_dto_1 = require("./dto/run-agents.dto");
let AgentsController = AgentsController_1 = class AgentsController {
    constructor(agentsService) {
        this.agentsService = agentsService;
        this.logger = new common_1.Logger(AgentsController_1.name);
    }
    async run(runAgentsDto) {
        this.logger.log(`Received agent run request for route ${runAgentsDto.routeId}`);
        return this.agentsService.runAgents(runAgentsDto.routeId);
    }
};
exports.AgentsController = AgentsController;
__decorate([
    (0, common_1.Post)('run'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [run_agents_dto_1.RunAgentsDto]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "run", null);
exports.AgentsController = AgentsController = AgentsController_1 = __decorate([
    (0, common_1.Controller)('agents'),
    __metadata("design:paramtypes", [agents_service_1.AgentsService])
], AgentsController);
//# sourceMappingURL=agents.controller.js.map