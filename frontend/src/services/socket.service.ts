import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import {
  addModerationReport,
  updateModerationReport,
  removeModerationReport,
  updateUserInList,
} from '../store/slices/adminSlice';

/**
 * WebSocket Service for real-time communication
 * Handles Socket.IO connection, authentication, and event subscriptions
 */
class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private isConnecting = false;

  /**
   * Initialize and connect to Socket.IO server
   * @param token - JWT authentication token
   */
  connect(token: string): void {
    if (this.socket?.connected || this.isConnecting) {
      console.log('Socket already connected or connecting');
      return;
    }

    this.isConnecting = true;
    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    console.log('🔌 Connecting to Socket.IO server...', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
    this.isConnecting = false;
  }

  /**
   * Setup Socket.IO event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✓ Socket.IO connected:', this.socket?.id);
      this.reconnectAttempts = 0;
      this.notifyConnectionStatus(true);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('✗ Socket.IO disconnected:', reason);
      this.notifyConnectionStatus(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error.message);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    // Admin-specific events
    this.socket.on('moderation:report-created', this.handleModerationReportCreated.bind(this));
    this.socket.on('moderation:report-updated', this.handleModerationReportUpdated.bind(this));
    this.socket.on('moderation:report-resolved', this.handleModerationReportResolved.bind(this));
    this.socket.on('admin:user-status-changed', this.handleUserStatusChanged.bind(this));
    this.socket.on('admin:user-registered', this.handleNewUserRegistered.bind(this));
    this.socket.on('admin:analytics-updated', this.handleAnalyticsUpdated.bind(this));
    this.socket.on('admin:settings-updated', this.handleSettingsUpdated.bind(this));

    // General events
    this.socket.on('notification:new', this.handleNotification.bind(this));
    this.socket.on('user:status-changed', this.handleOwnStatusChanged.bind(this));

    // Heartbeat
    this.socket.on('pong', () => {
      // Connection is alive
    });
  }

  /**
   * Handle new moderation report created
   */
  private handleModerationReportCreated(data: any): void {
    console.log('📢 New moderation report:', data);
    store.dispatch(addModerationReport(data.data));
    this.showNotification('New Moderation Report', `New ${data.data.severity} severity report created`, 'warning');
  }

  /**
   * Handle moderation report updated
   */
  private handleModerationReportUpdated(data: any): void {
    console.log('📢 Moderation report updated:', data);
    store.dispatch(updateModerationReport(data.data));
  }

  /**
   * Handle moderation report resolved
   */
  private handleModerationReportResolved(data: any): void {
    console.log('📢 Moderation report resolved:', data);
    store.dispatch(removeModerationReport(data.data._id));
    this.showNotification('Report Resolved', `Moderation report has been ${data.data.status}`, 'success');
  }

  /**
   * Handle user status changed
   */
  private handleUserStatusChanged(data: any): void {
    console.log('📢 User status changed:', data);
    store.dispatch(updateUserInList(data.data));
    this.showNotification(
      'User Status Changed',
      `User ${data.data.email} is now ${data.data.status}`,
      'info'
    );
  }

  /**
   * Handle new user registered
   */
  private handleNewUserRegistered(data: any): void {
    console.log('📢 New user registered:', data);
    this.showNotification(
      'New User Registration',
      `${data.data.firstName} ${data.data.lastName} just registered as ${data.data.role}`,
      'info'
    );
  }

  /**
   * Handle analytics updated
   */
  private handleAnalyticsUpdated(data: any): void {
    console.log('📢 Analytics updated:', data);
    // Could dispatch to Redux if needed
  }

  /**
   * Handle system settings updated
   */
  private handleSettingsUpdated(data: any): void {
    console.log('📢 System settings updated:', data);
    this.showNotification('Settings Updated', 'System settings have been updated', 'info');
  }

  /**
   * Handle general notification
   */
  private handleNotification(data: any): void {
    console.log('📢 Notification:', data);
    this.showNotification('Notification', data.data.message || 'You have a new notification', 'info');
  }

  /**
   * Handle own status changed (when admin's account is suspended/activated by another admin)
   */
  private handleOwnStatusChanged(data: any): void {
    console.log('📢 Your status changed:', data);
    this.showNotification(
      'Account Status Changed',
      `Your account is now ${data.data.status}`,
      'warning'
    );

    // If suspended, might want to logout or show a modal
    if (data.data.status === 'suspended') {
      // Handle suspended state - could dispatch logout action
    }
  }

  /**
   * Show browser notification (could be replaced with toast library)
   */
  private showNotification(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    // Dispatch custom event for notification system
    const event = new CustomEvent('socket:notification', {
      detail: { title, message, type },
    });
    window.dispatchEvent(event);

    // Also log to console
    const emoji = type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : 'ℹ';
    console.log(`${emoji} ${title}: ${message}`);
  }

  /**
   * Notify connection status change
   */
  private notifyConnectionStatus(connected: boolean): void {
    const event = new CustomEvent('socket:connection', {
      detail: { connected },
    });
    window.dispatchEvent(event);
  }

  /**
   * Send heartbeat ping
   */
  ping(): void {
    if (this.socket?.connected) {
      this.socket.emit('ping');
    }
  }

  /**
   * Emit a custom event
   */
  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  /**
   * Subscribe to a custom event
   */
  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Unsubscribe from a custom event
   */
  off(event: string, callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect(): void {
    if (this.socket) {
      console.log('Disconnecting from Socket.IO server');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Get socket instance (for advanced usage)
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
