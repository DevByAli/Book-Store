import { SocketIoConfig } from 'ngx-socket-io';

export const socketConfig: SocketIoConfig = {
  url: 'ws://localhost:50002',
  options: {
    transports: ['websocket'],
  },
};
