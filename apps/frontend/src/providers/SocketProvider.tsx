import React, { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { env } from '../config/env.js';
import { useAppDispatch, useAppSelector } from '../store/index.js';
import { setSocketConnected, addRoom, removeRoom } from '../store/slices/socketSlice.js';
import { SOCKET_EVENTS } from '@task-platform/shared';
import { useQueryClient } from '@tanstack/react-query';
import { showSuccess, showError } from '../lib/toast.js';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  subscribeToTask: (taskId: string) => void;
  unsubscribeFromTask: (taskId: string) => void;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { accessToken, isAuthenticated } = useAppSelector((state) => state.auth);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        dispatch(setSocketConnected(false));
      }
      return;
    }

    const socketInstance = io(env.VITE_SOCKET_URL, {
      auth: {
        token: accessToken,
      },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      dispatch(setSocketConnected(true));
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      dispatch(setSocketConnected(false));
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('[Socket.IO] Connection error:', err?.message || err);
      setIsConnected(false);
      dispatch(setSocketConnected(false));
    });

    // Real-time background job updates
    socketInstance.on(SOCKET_EVENTS.JOB_PROGRESS, (payload: { taskId: string; progress: number }) => {
      if (payload?.taskId) {
        queryClient.invalidateQueries({ queryKey: ['task', payload.taskId] });
      }
    });

    socketInstance.on(SOCKET_EVENTS.JOB_COMPLETED, (payload: { taskId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['queues'] });
      if (payload?.taskId) {
        queryClient.invalidateQueries({ queryKey: ['task', payload.taskId] });
      }
      showSuccess('Background job execution completed!');
    });

    socketInstance.on(SOCKET_EVENTS.JOB_FAILED, (payload: { taskId: string; error?: string }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['queues'] });
      if (payload?.taskId) {
        queryClient.invalidateQueries({ queryKey: ['task', payload.taskId] });
      }
      showError(payload.error || 'Background job execution failed.');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      dispatch(setSocketConnected(false));
    };
  }, [isAuthenticated, accessToken, queryClient, dispatch]);

  const subscribeToTask = (taskId: string) => {
    if (socket && taskId) {
      socket.emit(SOCKET_EVENTS.SUBSCRIBE_TASK, taskId);
      dispatch(addRoom(`task:${taskId}`));
    }
  };

  const unsubscribeFromTask = (taskId: string) => {
    if (socket && taskId) {
      socket.emit(SOCKET_EVENTS.UNSUBSCRIBE_TASK, taskId);
      dispatch(removeRoom(`task:${taskId}`));
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        subscribeToTask,
        unsubscribeFromTask,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
