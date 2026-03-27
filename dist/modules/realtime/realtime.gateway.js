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
var RealtimeGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let RealtimeGateway = RealtimeGateway_1 = class RealtimeGateway {
    constructor() {
        this.logger = new common_1.Logger(RealtimeGateway_1.name);
    }
    afterInit(server) {
        this.logger.log('Socket.IO Realtime Gateway Initialized safely');
    }
    handleConnection(client) {
        this.logger.log(`Client socket connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client socket disconnected: ${client.id}`);
    }
    emitRiskUpdate(data) {
        this.safeEmit('risk_update', data);
    }
    emitAlert(data) {
        this.safeEmit('alert', data);
    }
    emitRouteChange(data) {
        this.safeEmit('route_change', data);
    }
    safeEmit(event, data) {
        try {
            if (this.server) {
                this.server.emit(event, data);
                this.logger.log(`Broadcasted event ${event} securely via Socket.IO`);
            }
            else {
                this.logger.warn(`Failed to broadcast ${event}: WebSocket Server is unavailable.`);
            }
        }
        catch (error) {
            this.logger.error(`Fatal error broadcasting abstract event ${event}: ${error.message} (Isolating crash properly)`);
        }
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
exports.RealtimeGateway = RealtimeGateway = RealtimeGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map