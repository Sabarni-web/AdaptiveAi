import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../services/socketService';

export const useSocket = (sessionId) => {
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      socketService.connect(token);
    }
    return () => {
      socketService.disconnect();
    };
  }, [token]);

  // Periodic heartbeat
  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(() => {
      socketService.emitHeartbeat(sessionId);
    }, 30000);

    return () => clearInterval(interval);
  }, [sessionId]);

  return socketService;
};
export default useSocket;
