/**
 * Socket.IO Client Service
 * Real-time communication for notifications
 */

import { io } from 'socket.io-client';

// Get socket URL from API URL or fallback to default
const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    // Remove /api suffix to get base URL
    return apiUrl.replace('/api', '');
  }
  // Fallback to default backend port
  return 'http://localhost:8017';
};

const SOCKET_URL = getSocketUrl();

let socket = null;
let isConnecting = false;

/**
 * Initialize socket connection
 * @param {string} token - JWT token for authentication
 * @returns {Socket} Socket instance
 */
export function connectSocket(token) {
  if (socket?.connected) {
    console.log('[Socket] Already connected');
    return socket;
  }

  if (isConnecting) {
    console.log('[Socket] Connection in progress');
    return socket;
  }

  isConnecting = true;
  console.log('[Socket] Connecting to', SOCKET_URL);

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id);
    isConnecting = false;
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error.message);
    isConnecting = false;
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
  });

  return socket;
}

/**
 * Disconnect socket
 */
export function disconnectSocket() {
  if (socket) {
    console.log('[Socket] Disconnecting');
    socket.disconnect();
    socket = null;
    isConnecting = false;
  }
}

/**
 * Get socket instance
 * @returns {Socket|null} Socket instance
 */
export function getSocket() {
  return socket;
}

/**
 * Check if socket is connected
 * @returns {boolean} Connection status
 */
export function isConnected() {
  return socket?.connected || false;
}

/**
 * Subscribe to notification events
 * @param {Function} onNewNotification - Callback for new notification
 * @param {Function} onCountUpdate - Callback for count update
 * @returns {Function} Cleanup function
 */
export function subscribeToNotifications(onNewNotification, onCountUpdate) {
  const handleNewNotification = (data) => {
    console.log('[Socket] New notification:', data);
    if (onNewNotification) {
      onNewNotification(data.notification);
    }
    if (onCountUpdate && data.unreadCount !== undefined) {
      onCountUpdate(data.unreadCount);
    }
  };

  const handleCountUpdate = (data) => {
    console.log('[Socket] Count update:', data);
    if (onCountUpdate) {
      onCountUpdate(data.count);
    }
  };

  // If socket already connected, subscribe immediately
  if (socket?.connected) {
    console.log('[Socket] Subscribing to notifications (already connected)');
    socket.on('new_notification', handleNewNotification);
    socket.on('notification_count', handleCountUpdate);
  } else if (socket) {
    // Socket exists but not connected yet, listen for connect event
    console.log('[Socket] Waiting for connection to subscribe...');
    const onConnect = () => {
      console.log('[Socket] Connected, now subscribing to notifications');
      socket.on('new_notification', handleNewNotification);
      socket.on('notification_count', handleCountUpdate);
    };
    socket.once('connect', onConnect);
  } else {
    console.warn('[Socket] Not initialized, cannot subscribe');
  }

  // Return cleanup function
  return () => {
    if (socket) {
      socket.off('new_notification', handleNewNotification);
      socket.off('notification_count', handleCountUpdate);
    }
  };
}

/**
 * Emit notification read event
 * @param {string} notificationId - Notification ID
 */
export function emitNotificationRead(notificationId) {
  if (socket?.connected) {
    socket.emit('notification_read', { notificationId });
  }
}

export default {
  connectSocket,
  disconnectSocket,
  getSocket,
  isConnected,
  subscribeToNotifications,
  emitNotificationRead
};
