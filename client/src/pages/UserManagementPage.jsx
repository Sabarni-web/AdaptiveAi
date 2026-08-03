import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, UserMinus, ShieldAlert } from 'lucide-react';
import adminService from '../services/adminService';
import { PageHeader } from '../components/common/PageHeader';
import { DataTable } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { toast } from 'sonner';

export const UserManagementPage = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminService.getUsers,
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      toast.success('User role updated successfully.');
    },
  });

  const blockMutation = useMutation({
    mutationFn: (userId) => adminService.toggleUserBlock(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      toast.success('User status updated successfully.');
    },
  });

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (val) => (
        <Badge variant={val === 'admin' ? 'danger' : val === 'teacher' ? 'info' : 'neutral'}>
          {val}
        </Badge>
      ),
    },
    {
      key: 'isBlocked',
      header: 'Status',
      render: (val) => (
        <Badge variant={val ? 'danger' : 'success'}>
          {val ? 'Blocked' : 'Active'}
        </Badge>
      ),
    },
  ];

  const rowActions = [
    {
      label: 'Toggle Block Status',
      icon: <ShieldAlert className="h-4 w-4" />,
      onClick: (row) => blockMutation.mutate(row.id),
    },
    {
      label: 'Promote to Teacher',
      icon: <ShieldCheck className="h-4 w-4" />,
      onClick: (row) => roleMutation.mutate({ userId: row.id, role: 'teacher' }),
    },
    {
      label: 'Demote to Student',
      icon: <UserMinus className="h-4 w-4" />,
      onClick: (row) => roleMutation.mutate({ userId: row.id, role: 'student' }),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        title="User Management"
        description="Configure registration profiles, update roles, and manage credentials."
      />

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        rowActions={rowActions}
        emptyState={
          <div className="text-center text-slate-400 py-12">
            No registered users found in system.
          </div>
        }
      />
    </div>
  );
};
export default UserManagementPage;
