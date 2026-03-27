import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  afterInit(server: Server) {
    this.logger.log('Socket.IO Realtime Gateway Initialized safely');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client socket connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client socket disconnected: ${client.id}`);
  }

  emitRiskUpdate(data: any) {
    this.safeEmit('risk_update', data);
  }

  emitAlert(data: any) {
    this.safeEmit('alert', data);
  }

  emitRouteChange(data: any) {
    this.safeEmit('route_change', data);
  }

  private safeEmit(event: string, data: any) {
    try {
      if (this.server) {
        this.server.emit(event, data);
        this.logger.log(`Broadcasted event ${event} securely via Socket.IO`);
      } else {
        this.logger.warn(`Failed to broadcast ${event}: WebSocket Server is unavailable.`);
      }
    } catch (error) {
      this.logger.error(`Fatal error broadcasting abstract event ${event}: ${error.message} (Isolating crash properly)`);
    }
  }
}
