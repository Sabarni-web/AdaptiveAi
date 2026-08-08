import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (this.socket?.connected) return;

    const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    this.socket = io(url, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    console.log('Socket.IO connection initiated');
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Emitters
  emitHeartbeat(sessionId) {
    this.socket?.emit('heartbeat', { sessionId, timestamp: new Date().toISOString() });
  }

  emitAnswer(sessionId, data) {
    this.socket?.emit('submit_answer', { sessionId, ...data });
  }

  emitFocusChange(sessionId, isFocused) {
    this.socket?.emit('focus_change', { sessionId, isFocused, timestamp: new Date().toISOString() });
  }



  // Event Listeners
  onTimeWarning(callback) {
    this.socket?.on('time_warning', callback);
  }

  onForceSubmitNotice(callback) {
    this.socket?.on('force_submit_notice', callback);
  }

  onGradeReady(callback) {
    this.socket?.on('grade_ready', callback);
  }

  onExamControl(callback) {
    this.socket?.on('exam_control', callback);
  }

  removeListeners() {
    this.socket?.off('time_warning');
    this.socket?.off('force_submit_notice');
    this.socket?.off('grade_ready');
    this.socket?.off('exam_control');
  }
}

const socketService = new SocketService();
export default socketService;
