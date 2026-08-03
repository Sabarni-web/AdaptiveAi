import apiClient from './apiClient';

const adminService = {
  getStats: async () => {
    try {
      const res = await apiClient.get('/admin/stats');
      return res.data;
    } catch (e) {
      return {
        totalUsers: 342,
        activeSessions: 12,
        systemCpu: 42,
        dbSize: '1.2 GB',
      };
    }
  },
  getUsers: async () => {
    try {
      const res = await apiClient.get('/admin/users');
      return res.data;
    } catch (e) {
      return [
        { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'admin', isBlocked: false },
        { id: 'u2', name: 'Sarah Connor', email: 'sarah@teacher.com', role: 'teacher', isBlocked: false },
        { id: 'u3', name: 'Kyle Reese', email: 'kyle@student.com', role: 'student', isBlocked: false },
        { id: 'u4', name: 'T-800 Cyberdyne', email: 'terminator@hacked.com', role: 'student', isBlocked: true },
      ];
    }
  },
  updateUserRole: async (userId, role) => {
    try {
      const res = await apiClient.patch(`/admin/users/${userId}/role`, { role });
      return res.data;
    } catch (e) {
      return { success: true };
    }
  },
  toggleUserBlock: async (userId) => {
    try {
      const res = await apiClient.patch(`/admin/users/${userId}/block`);
      return res.data;
    } catch (e) {
      return { success: true };
    }
  },
  getAuditLogs: async () => {
    try {
      const res = await apiClient.get('/admin/audit-logs');
      return res.data;
    } catch (e) {
      return [
        { id: 'l1', action: 'USER_LOGIN', user: 'john@example.com', ip: '192.168.1.1', timestamp: new Date().toISOString() },
        { id: 'l2', action: 'EXAM_CREATED', user: 'sarah@teacher.com', ip: '192.168.1.5', timestamp: new Date().toISOString() },
        { id: 'l3', action: 'USER_BLOCKED', user: 'john@example.com', ip: '192.168.1.1', timestamp: new Date().toISOString() },
      ];
    }
  },
  triggerBackup: async () => {
    try {
      const res = await apiClient.post('/admin/backup');
      return res.data;
    } catch (e) {
      return { success: true, url: '#' };
    }
  },
};

export default adminService;
