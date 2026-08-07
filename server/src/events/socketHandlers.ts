import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const setupSocketHandlers = (io: Server) => {
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    logger.info(`Socket connected: ${socket.id} (User: ${user.userId})`);

    // Join personal room
    socket.join(`user:${user.userId}`);
    
    if (user.role === 'teacher') {
      socket.join(`teacher:${user.userId}`);
    }

    // Student events
    socket.on('join_exam', ({ sessionId }) => {
      socket.join(`exam:${sessionId}`);
      logger.info(`User ${user.userId} joined exam session ${sessionId}`);
    });

    socket.on('answer_submitted', ({ sessionId, questionId, answer, timeSpent }) => {
      // Logic handled via REST API, but can emit to teacher room if monitoring
      io.to(`exam_monitor:${sessionId}`).emit('student_answered', { sessionId, questionId, timeSpent });
    });

    socket.on('heartbeat', ({ sessionId, timestamp }) => {
      // Update session last seen or broadcast to teacher
    });

    socket.on('focus_change', ({ sessionId, isFocused }) => {
       logger.info(`Session ${sessionId} focus changed: ${isFocused}`);
    });

    socket.on('fullscreen_change', ({ sessionId, isFullscreen }) => {
       logger.info(`Session ${sessionId} fullscreen changed: ${isFullscreen}`);
    });

    // Proctoring events
    socket.on('faceDetected', ({ sessionId, confidence, timestamp }) => {
       io.to(`exam_monitor:${sessionId}`).emit('student_face_detected', { userId: user.userId, confidence, timestamp });
    });

    socket.on('faceLost', ({ sessionId, timestamp }) => {
       io.to(`exam_monitor:${sessionId}`).emit('student_face_lost', { userId: user.userId, timestamp });
    });

    socket.on('warningIssued', ({ sessionId, timestamp }) => {
       io.to(`exam_monitor:${sessionId}`).emit('student_warning_issued', { userId: user.userId, timestamp });
       // Also notify admin dashboard
       io.to('admin_dashboard').emit('proctoring_alert', { type: 'WARNING', userId: user.userId, sessionId, timestamp });
    });

    socket.on('violationLogged', ({ sessionId, duration, timestamp }) => {
       io.to(`exam_monitor:${sessionId}`).emit('student_violation', { userId: user.userId, duration, timestamp });
       io.to('admin_dashboard').emit('proctoring_alert', { type: 'VIOLATION', userId: user.userId, sessionId, duration, timestamp });
    });

    // Teacher events
    socket.on('join_monitoring', ({ examId }) => {
       if (['teacher', 'admin'].includes(user.role)) {
          socket.join(`exam_monitor:${examId}`);
       }
    });

    // Admin events
    socket.on('join_admin_dashboard', () => {
       if (user.role === 'admin' || user.role === 'super_admin') {
          socket.join('admin_dashboard');
       }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id} (User: ${user.userId})`);
    });
  });
};
