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

    socketService.socket?.on('multiplePersonWarning', (data) => {
      setLiveStudents((prev) =>
        prev.map((s) => {
          if (s.id === data.sessionId) { // Assume sessionId matches student id or we can match appropriately
            return { ...s, multiplePersons: true, personsCount: data.personsDetected };
          }
          return s;
        })
      );
    });

    socketService.socket?.on('multiplePersonDetected', (data) => {
      setLiveStudents((prev) =>
        prev.map((s) => {
          if (s.id === data.sessionId) {
             toast.error(`Critical Proctor Alert: ${s.name} has multiple persons (${data.personsDetected}) in view!`);
             return { ...s, multiplePersons: true, personsCount: data.personsDetected, violations: (s.violations || 0) + 1 };
          }
          return s;
        })
      );
    });

    socketService.socket?.on('multiplePersonResolved', (data) => {
      setLiveStudents((prev) =>
        prev.map((s) => {
          if (s.id === data.sessionId) {
            return { ...s, multiplePersonDetected: false, personsDetected: 1, alerts: s.alerts.filter(a => a !== 'Multiple Persons') };
          }
          return s;
        })
      );
    });

    socketService.socket?.on('headDirectionChanged', (data) => {
      setLiveStudents((prev) =>
        prev.map((s) => {
          if (s.id === data.sessionId) {
             return { ...s, headDirection: data.direction, focusStatus: data.focusStatus };
          }
          return s;
        })
      );
    });
    
    socketService.socket?.on('lookingAwayWarning', (data) => {
      setLiveStudents((prev) =>
        prev.map((s) => {
          if (s.id === data.sessionId) {
             const newAlerts = s.alerts.includes('Looking Away') ? s.alerts : [...s.alerts, 'Looking Away'];
             return { ...s, alerts: newAlerts };
          }
          return s;
        })
      );
    });
    
    socketService.socket?.on('lookingAwayViolation', (data) => {
      setLiveStudents((prev) =>
        prev.map((s) => {
          if (s.id === data.sessionId) {
             const newAlerts = s.alerts.includes('Critical Focus') ? s.alerts : [...s.alerts, 'Critical Focus'];
             return { ...s, alerts: newAlerts, violations: (s.violations || 0) + 1 };
          }
          return s;
        })
      );
    });

    socketService.socket?.on('integrityUpdated', (data) => {
      setLiveStudents((prev) =>
        prev.map((s) => {
          if (s.id === data.sessionId) {
            return { ...s, integrityScore: data.newScore };
          }
          return s;
        })
      );
    });

    return () => {
      socketService.socket?.off('student_focus_change');
      socketService.socket?.off('multiplePersonWarning');
      socketService.socket?.off('multiplePersonDetected');
      socketService.socket?.off('multiplePersonResolved');
      socketService.socket?.off('integrityUpdated');
      socketService.socket?.off('headDirectionChanged');
      socketService.socket?.off('lookingAwayWarning');
      socketService.socket?.off('lookingAwayViolation');
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
            const hasAlert = student.focusViolations > 2 || student.multiplePersons;
            const integrity = student.integrityScore ?? 100;

            return (
              <Card
                key={student.id}
                className={`flex flex-col gap-4 relative overflow-hidden ${
                  hasAlert ? 'border-red-500 ring-2 ring-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''
                }`}
              >
                {hasAlert && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-[10px] font-bold rounded-bl-xl flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" />
                    <span>Alert</span>
                  </div>
                )}

                <div className="flex flex-col flex-1 h-full pt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-surface-2 border border-hair flex items-center justify-center font-bold text-xl text-primary shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-primary truncate max-w-[150px]">{student.name}</span>
                      <span className="text-xs text-secondary">{student.email}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-void/50 text-secondary border border-hair px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                      {student.question}
                    </span>
                    
                    {student.headDirection && (
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 ${student.focusStatus === 'LOOKING_AWAY' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-mint/10 text-mint border border-mint/20'}`}>
                        {student.headDirection}
                      </span>
                    )}

                    {student.multiplePersonDetected && (
                      <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 animate-pulse">
                        <Users className="w-3 h-3" /> {student.personsDetected} Persons
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(student.status)}
                    <span className={`text-[10px] font-bold uppercase ${integrity < 70 ? 'text-red-500' : 'text-mint'}`}>
                      Integrity: {integrity}%
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Progress</span>
                    <span>{student.progress}%</span>
                  </div>
                  <Progress value={student.progress} color={hasAlert ? 'bg-red-500' : 'bg-primary-600'} />
                </div>

                <div className="flex justify-between items-center text-xs font-bold mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                  <div className="flex flex-col gap-1">
                    <span>Tab Switches: <span className={student.focusViolations > 2 ? 'text-red-500' : ''}>{student.focusViolations}</span></span>
                    <span>Persons Visible: <span className={student.multiplePersons ? 'text-red-500' : 'text-mint'}>{student.personsCount || 1}</span></span>
                  </div>
                  <div className="flex flex-col text-right gap-1">
                    <span>AI Violations:</span>
                    <span className={student.violations > 0 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}>
                      {student.violations || 0} occurrences
                    </span>
                  </div>
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
