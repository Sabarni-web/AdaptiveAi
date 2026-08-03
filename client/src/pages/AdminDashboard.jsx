import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import adminService from '../services/adminService';
import { StatCard } from '../components/analytics/StatCard';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Loader } from '../components/common/Loader';
import { Button } from '../components/common/Button';
import { ShieldCheck, HardDrive, Users, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminService.getStats,
  });

  const backupMutation = useMutation({
    mutationFn: adminService.triggerBackup,
    onSuccess: () => {
      toast.success('Database backup completed successfully!');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader size="lg" text="Loading system metrics..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader
        title="Admin Control Center"
        description="Monitor system resources, database backups, and audits."
        actions={[
          <Button
            onClick={() => backupMutation.mutate()}
            isLoading={backupMutation.isLoading}
            className="flex items-center gap-2"
          >
            <HardDrive className="h-4 w-4" />
            <span>Backup Database</span>
          </Button>,
        ]}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users Registered"
          value={stats?.totalUsers || 0}
          trend="up"
          change={4}
          changeLabel="new signups"
          icon={<Users className="h-5 w-5" />}
          color="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          title="Active Sessions"
          value={stats?.activeSessions || 0}
          trend="up"
          change={25}
          changeLabel="active now"
          icon={<ShieldCheck className="h-5 w-5" />}
          color="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
        />
        <StatCard
          title="System CPU load"
          value={`${stats?.systemCpu || 0}%`}
          trend="neutral"
          change={0}
          changeLabel="stable load"
          icon={<SettingsIcon className="h-5 w-5" />}
          color="bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
        />
        <StatCard
          title="Database Size"
          value={stats?.dbSize || '0 GB'}
          trend="neutral"
          change={0}
          changeLabel="allocated space"
          icon={<HardDrive className="h-5 w-5" />}
          color="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
        />
      </div>

      <Card title="System Performance Summary" description="All nodes are currently healthy and operational.">
        <div className="flex flex-col gap-4 text-xs font-semibold text-slate-500">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <span>Primary Database Node</span>
            <span className="text-green-500">Connected &amp; Healthy</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <span>Real-time Event Broker (Socket.IO)</span>
            <span className="text-green-500">Connected &amp; Active</span>
          </div>
          <div className="flex justify-between items-center">
            <span>S3 Media Artifact Storage</span>
            <span className="text-green-500">Operational</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default AdminDashboard;
