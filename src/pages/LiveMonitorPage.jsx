import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert, Activity, UserCheck } from 'lucide-react';
import teacherService from '../services/teacherService';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Progress } from '../components/common/Progress';
import socketService from '../services/socketService';
import { toast } from 'sonner';

export const LiveMonitorPage = () => {
  const [liveStudents, setLiveStudents] = useState([]);

  const { data: initialStudents = [], isLoading } = useQuery({
    queryKey: ['liveStudents'],
    queryFn: teacherService.getLiveStudents,
  });

  useEffect(() => {
    if (initialStudents.length > 0) {
      setLiveStudents(initialStudents);
    }
  }, [initialStudents]);

  // Hook up live socket listeners for proctoring events
  useEffect(() => {
    socketService.connect(localStorage.getItem('token'));

    socketService.socket?.on('student_focus_change', (data) => {
      // data: { studentId, name, isFocused }
      setLiveStudents((prev) =>
        prev.map((s) => {
          if (s.id === data.studentId) {
            const focusViolations = data.isFocused ? s.focusViolations : s.focusViolations + 1;
            if (!data.isFocused) {
              toast.error(`Proctor Alert: ${data.name} switched tabs!`);
            }
            return {
              ...s,
              status: data.isFocused ? 'online' : 'away',
              focusViolations,
            };
          }
          return s;
        })
      );
    });

    return () => {
      socketService.socket?.off('student_focus_change');
    };
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'online':
        return <Badge variant="success">Online</Badge>;
      case 'away':
        return <Badge variant="warning">Tab Switched</Badge>;
      default:
        return <Badge variant="neutral">Offline</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        title="Live Proctor Monitor"
        description="Monitor active evaluation sessions and tab compliance checks."
      />

      {isLoading ? (
        <div className="text-center text-slate-400 py-12">Loading active sessions...</div>
      ) : liveStudents.length === 0 ? (
        <div className="text-center text-slate-400 py-12 flex flex-col items-center justify-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl">
          <UserCheck className="h-10 w-10 text-slate-500" />
          <p className="font-bold">No active evaluation sessions in progress.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveStudents.map((student) => {
            const hasAlert = student.focusViolations > 2;

            return (
              <Card
                key={student.id}
                className={`flex flex-col gap-4 relative overflow-hidden ${
                  hasAlert ? 'border-red-500 ring-2 ring-red-500/10' : ''
                }`}
              >
                {hasAlert && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-[10px] font-bold rounded-bl-xl flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" />
                    <span>Focus Alert</span>
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-extrabold text-slate-850 dark:text-white">
                      {student.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Time remaining: {student.timeRemaining}
                    </span>
                  </div>
                  <div>{getStatusBadge(student.status)}</div>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Progress</span>
                    <span>{student.progress}%</span>
                  </div>
                  <Progress value={student.progress} color={hasAlert ? 'bg-red-500' : 'bg-primary-600'} />
                </div>

                <div className="flex justify-between items-center text-xs font-bold mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                  <span>Tab Switches:</span>
                  <span className={hasAlert ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}>
                    {student.focusViolations} occurrences
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default LiveMonitorPage;
