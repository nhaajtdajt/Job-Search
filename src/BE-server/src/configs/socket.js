/**
 * Socket.IO Configuration
 * Real-time communication for notifications
 */

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const environment = require('./environment.config');

// Map to store user connections: userId -> Set of socket IDs
const userSockets = new Map();

let io = null;

/**
 * Initialize Socket.IO server
 * @param {http.Server} httpServer - HTTP server instance
 * @returns {Server} Socket.IO server instance
 */
function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: environment.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    path: '/socket.io',
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (!token) {
        console.log('[Socket.IO] No token provided, allowing anonymous connection');
        socket.userId = null;
        return next();
      }

      // Verify JWT token
      const decoded = jwt.verify(token, environment.JWT_SECRET || environment.SUPABASE_JWT_SECRET);
      socket.userId = decoded.sub || decoded.user_id || decoded.id;
      console.log(`[Socket.IO] Authenticated user: ${socket.userId}`);
      next();
    } catch (error) {
      console.log('[Socket.IO] Authentication error:', error.message);
      // Allow connection but without userId for public features
      socket.userId = null;
      next();
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Register user socket
    if (socket.userId) {
      if (!userSockets.has(socket.userId)) {
        userSockets.set(socket.userId, new Set());
      }
      userSockets.get(socket.userId).add(socket.id);
      console.log(`[Socket.IO] User ${socket.userId} registered with socket ${socket.id}`);
      
      // Join user-specific room
      socket.join(`user:${socket.userId}`);
    }

    // Handle notification read event from client
    socket.on('notification_read', (data) => {
      console.log(`[Socket.IO] Notification read:`, data);
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}, reason: ${reason}`);
      
      // Remove socket from user's set
      if (socket.userId && userSockets.has(socket.userId)) {
        userSockets.get(socket.userId).delete(socket.id);
        if (userSockets.get(socket.userId).size === 0) {
          userSockets.delete(socket.userId);
        }
      }
    });
  });

  console.log('[Socket.IO] Server initialized');
  return io;
}

/**
 * Get Socket.IO server instance
 * @returns {Server|null} Socket.IO server instance
 */
function getIO() {
  return io;
}

/**
 * Emit notification to specific user
 * @param {string} userId - User ID to send notification to
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
function emitToUser(userId, event, data) {
  if (!io) {
    console.log('[Socket.IO] Server not initialized');
    return;
  }

  // Emit to user-specific room
  io.to(`user:${userId}`).emit(event, data);
  console.log(`[Socket.IO] Emitted ${event} to user ${userId}`);
}

/**
 * Emit notification to all connected clients
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
function emitToAll(event, data) {
  if (!io) {
    console.log('[Socket.IO] Server not initialized');
    return;
  }

  io.emit(event, data);
  console.log(`[Socket.IO] Emitted ${event} to all clients`);
}

/**
 * Get connected users count
 * @returns {number} Number of unique connected users
 */
function getConnectedUsersCount() {
  return userSockets.size;
}

module.exports = {
  initializeSocket,
  getIO,
  emitToUser,
  emitToAll,
  getConnectedUsersCount
};
