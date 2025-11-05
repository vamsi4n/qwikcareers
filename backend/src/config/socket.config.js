const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../modules/auth/models/User.model');

/**
 * Initialize Socket.IO server
 * @param {Object} httpServer - HTTP server instance
 * @returns {Object} Socket.IO server instance
 */
const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      // Attach user to socket
      socket.userId = user._id.toString();
      socket.userRole = user.role;
      socket.user = user;

      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✓ User connected: ${socket.userId} (${socket.userRole})`);

    // Join user to their personal room
    socket.join(`user:${socket.userId}`);

    // Join admin users to admin room
    if (socket.userRole === 'admin') {
      socket.join('admin-room');
      console.log(`✓ Admin ${socket.userId} joined admin room`);
    }

    // Join employer users to employer room
    if (socket.userRole === 'employer') {
      socket.join('employer-room');
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`✗ User disconnected: ${socket.userId}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Heartbeat to keep connection alive
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  return io;
};

module.exports = { initializeSocket };
