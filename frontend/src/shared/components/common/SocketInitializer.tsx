import { useEffect } from 'react';
import useSocket from '../../../hooks/useSocket';

/**
 * SocketInitializer Component
 * Initializes WebSocket connection when user is authenticated
 * This component doesn't render anything, just handles the connection logic
 */
const SocketInitializer = () => {
  // Initialize socket connection (hook handles connection/disconnection)
  useSocket();

  return null;
};

export default SocketInitializer;
