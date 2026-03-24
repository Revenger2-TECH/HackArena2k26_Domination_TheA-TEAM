import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket = null;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('qr:generated', (data) => {
      console.log('QR Generated:', data);
      setLastEvent({ type: 'qr:generated', data, time: new Date() });
    });

    socket.on('attendance:marked', (data) => {
      console.log('Attendance marked:', data);
      setLastEvent({ type: 'attendance:marked', data, time: new Date() });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('qr:generated');
      socket.off('attendance:marked');
    };
  }, []);

  const register = (userId, role) => {
    if (socket?.connected) {
      socket.emit('register', { userId, role });
    }
  };

  const on = (event, callback) => {
    socket?.on(event, callback);
    return () => socket?.off(event, callback);
  };

  return { isConnected, lastEvent, register, socket, on };
}

export function getSocket() {
  return socket;
}
