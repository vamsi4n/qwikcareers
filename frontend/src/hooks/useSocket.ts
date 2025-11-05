import { useEffect } from 'react';
import { useAppSelector } from '../store';
import socketService from '../services/socket.service';

/**
 * Custom hook to manage Socket.IO connection
 * Automatically connects when user is authenticated and disconnects on unmount
 */
export const useSocket = () => {
  const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only connect if authenticated and token exists
    if (isAuthenticated && token) {
      console.log('🔌 Initializing WebSocket connection...');
      socketService.connect(token);

      // Send periodic ping to keep connection alive
      const pingInterval = setInterval(() => {
        if (socketService.isConnected()) {
          socketService.ping();
        }
      }, 25000); // Ping every 25 seconds

      // Cleanup on unmount
      return () => {
        clearInterval(pingInterval);
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, token]);

  return {
    isConnected: socketService.isConnected(),
    emit: socketService.emit.bind(socketService),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
  };
};

export default useSocket;
