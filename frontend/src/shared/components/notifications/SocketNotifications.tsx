import { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  WifiIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

interface ConnectionStatus {
  connected: boolean;
}

/**
 * SocketNotifications Component
 * Displays real-time notifications from WebSocket events
 * Also shows connection status indicator
 */
const SocketNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ connected: false });
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);

  useEffect(() => {
    // Listen for socket notifications
    const handleNotification = (event: any) => {
      const { title, message, type } = event.detail;
      const notification: Notification = {
        id: `${Date.now()}-${Math.random()}`,
        title,
        message,
        type,
        timestamp: Date.now(),
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto remove after 5 seconds
      setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);
    };

    // Listen for connection status changes
    const handleConnectionStatus = (event: any) => {
      const { connected } = event.detail;
      setConnectionStatus({ connected });
      setShowConnectionStatus(true);

      // Hide connection status after 3 seconds if connected
      if (connected) {
        setTimeout(() => {
          setShowConnectionStatus(false);
        }, 3000);
      }
    };

    window.addEventListener('socket:notification', handleNotification);
    window.addEventListener('socket:connection', handleConnectionStatus);

    return () => {
      window.removeEventListener('socket:notification', handleNotification);
      window.removeEventListener('socket:connection', handleConnectionStatus);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />;
      case 'info':
      default:
        return <InformationCircleIcon className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <>
      {/* Connection Status Indicator */}
      <AnimatePresence>
        {(showConnectionStatus || !connectionStatus.connected) && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60]"
          >
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
                connectionStatus.connected
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              <WifiIcon className="w-5 h-5" />
              <span className="text-sm font-medium">
                {connectionStatus.connected ? 'Connected to server' : 'Disconnected from server'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`bg-white rounded-lg shadow-xl border-l-4 ${getBorderColor(
                notification.type
              )} p-4 max-w-md`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SocketNotifications;
