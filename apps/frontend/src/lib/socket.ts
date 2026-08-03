import { io, Socket } from 'socket.io-client';
import { env } from '../config/env.js';

const SOCKET_URL = env.VITE_SOCKET_URL || undefined;

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
});
