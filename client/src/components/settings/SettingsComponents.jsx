import React from 'react';
import { Card } from '../common/Card';
import { Select } from '../common/Select';
import { Switch } from '../common/Switch';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Palette, Bot, BookOpen, Bell, Zap, Clock, Accessibility, Volume2, Shield, Database, Trash2, Download, Mic } from 'lucide-react';

export const SettingsSummary = ({ settings }) => {
  return (
    <Card className="mb-6 border-l-4 border-l-primary bg-surface/50">
      <div className="flex items-start gap-4">
        <Zap className="h-6 w-6 text-primary mt-1" />
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-1">Your Preferences</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            <div>
              <p className="text-xs text-text-secondary">Theme</p>
              <p className="text-sm font-medium capitalize">{settings?.appearance?.theme || 'Dark'}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">AI Style</p>
              <p className="text-sm font-medium">{settings?.ai?.explanationStyle || 'Balanced'}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Difficulty</p>
              <p className="text-sm font-medium">{settings?.study?.preferredDifficulty || 'Adaptive'}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Daily Goal</p>
              <p className="text-sm font-medium">{settings?.study?.dailyStudyGoal || '30 min'}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const AppearanceSettings = ({ register, watch, setValue }) => (
  <Card title={<div className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /> Appearance & Preferences</div>} description="Configure visual appearance themes and display features.">
    <div className="flex flex-col gap-4 mt-4">
      <Select
        label="Theme"
        options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }, { value: 'system', label: 'System' }]}
        {...register('appearance.theme')}
      />
      <Select
        label="Accent Color"
        options={[{ value: 'default', label: 'AdaptiveAI Default' }, { value: 'blue', label: 'Blue' }, { value: 'purple', label: 'Purple' }, { value: 'orange', label: 'Orange' }]}
        {...register('appearance.accentColor')}
      />
      <Switch 
        label="Reduce Animations" 
        checked={watch('appearance.reduceAnimations')} 
        onChange={(v) => setValue('appearance.reduceAnimations', v, { shouldDirty: true })} 
      />
      <Switch 
        label="Compact Interface" 
        checked={watch('appearance.compactInterface')} 
        onChange={(v) => setValue('appearance.compactInterface', v, { shouldDirty: true })} 
      />
      <Switch 
        label="Show Dashboard Animations" 
        checked={watch('appearance.dashboardAnimations')} 
        onChange={(v) => setValue('appearance.dashboardAnimations', v, { shouldDirty: true })} 
      />
    </div>
  </Card>
);

export const AiLearningSettings = ({ register, watch, setValue }) => (
  <Card title={<div className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> AI Learning Preferences</div>} description="Control how AdaptiveAI helps you learn.">
    <div className="flex flex-col gap-4 mt-4">
      <Select
        label="Explanation Style"
        options={[{ value: 'Beginner', label: 'Beginner' }, { value: 'Balanced', label: 'Balanced' }, { value: 'Detailed', label: 'Detailed' }]}
        {...register('ai.explanationStyle')}
      />
      <Switch 
        label="AI Recommendations" 
        checked={watch('ai.recommendationsEnabled')} 
        onChange={(v) => setValue('ai.recommendationsEnabled', v, { shouldDirty: true })} 
      />
      <Switch 
        label="Personalized Learning" 
        checked={watch('ai.personalizedLearning')} 
        onChange={(v) => setValue('ai.personalizedLearning', v, { shouldDirty: true })} 
      />
      <Switch 
        label="Automatic Answer Explanation" 
        checked={watch('ai.automaticExplanation')} 
        onChange={(v) => setValue('ai.automaticExplanation', v, { shouldDirty: true })} 
      />
      <Switch 
        label="AI Study Suggestions" 
        checked={watch('ai.studySuggestions')} 
        onChange={(v) => setValue('ai.studySuggestions', v, { shouldDirty: true })} 
      />
    </div>
  </Card>
);

export const StudySettings = ({ register, watch, setValue }) => (
  <Card title={<div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Study Preferences</div>} description="Customize your core learning experience.">
    <div className="flex flex-col gap-4 mt-4">
      <Select
        label="Primary CSE Domain"
        options={[
          { value: 'CSE Core', label: 'CSE Core' }, 
          { value: 'CSE AI/ML', label: 'CSE AI/ML' }, 
          { value: 'CSE Data Science', label: 'CSE Data Science' },
          { value: 'CSE Cyber Security', label: 'CSE Cyber Security' },
          { value: 'CSE Software Engineering', label: 'CSE Software Engineering' }
        ]}
        {...register('study.primaryDomain')}
      />
      <Select
        label="Preferred Difficulty"
        options={[{ value: 'Easy', label: 'Easy' }, { value: 'Medium', label: 'Medium' }, { value: 'Hard', label: 'Hard' }, { value: 'Adaptive', label: 'Adaptive' }]}
        {...register('study.preferredDifficulty')}
      />
      <Select
        label="Daily Study Goal"
        options={[
          { value: '15 minutes', label: '15 minutes' }, 
          { value: '30 minutes', label: '30 minutes' }, 
          { value: '45 minutes', label: '45 minutes' },
          { value: '60 minutes', label: '60 minutes' },
          { value: '90 minutes', label: '90 minutes' }
        ]}
        {...register('study.dailyStudyGoal')}
      />
    </div>
  </Card>
);

export const NotificationSettings = ({ watch, setValue }) => (
  <Card title={<div className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notifications</div>} description="Manage alerts and communications.">
    <div className="flex flex-col gap-4 mt-4">
      <Switch label="Daily Challenge Reminder" checked={watch('notifications.dailyChallenge')} onChange={(v) => setValue('notifications.dailyChallenge', v, { shouldDirty: true })} />
      <Switch label="Exam Reminder" checked={watch('notifications.examReminder')} onChange={(v) => setValue('notifications.examReminder', v, { shouldDirty: true })} />
      <Switch label="Exam Result Notification" checked={watch('notifications.resultNotification')} onChange={(v) => setValue('notifications.resultNotification', v, { shouldDirty: true })} />
      <Switch label="AI Recommendation Notification" checked={watch('notifications.aiRecommendation')} onChange={(v) => setValue('notifications.aiRecommendation', v, { shouldDirty: true })} />
      <Switch label="Certificate Notification" checked={watch('notifications.certificate')} onChange={(v) => setValue('notifications.certificate', v, { shouldDirty: true })} />
      <Switch label="Achievement Notification" checked={watch('notifications.achievement')} onChange={(v) => setValue('notifications.achievement', v, { shouldDirty: true })} />
      <Switch label="Streak Notification" checked={watch('notifications.streak')} onChange={(v) => setValue('notifications.streak', v, { shouldDirty: true })} />
      <Switch label="System Notification" checked={watch('notifications.system')} onChange={(v) => setValue('notifications.system', v, { shouldDirty: true })} />
    </div>
  </Card>
);

export const DailyChallengeSettings = ({ register, watch, setValue }) => (
  <Card title={<div className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> Daily Challenge</div>} description="Configure your daily learning habit.">
    <div className="flex flex-col gap-4 mt-4">
      <Switch label="Daily Challenge Enabled" checked={watch('dailyChallenge.enabled')} onChange={(v) => setValue('dailyChallenge.enabled', v, { shouldDirty: true })} />
      <Select
        label="Preferred Difficulty"
        options={[{ value: 'Easy', label: 'Easy' }, { value: 'Medium', label: 'Medium' }, { value: 'Hard', label: 'Hard' }, { value: 'Adaptive', label: 'Adaptive' }]}
        {...register('dailyChallenge.difficulty')}
      />
      <Switch label="Reminder Enabled" checked={watch('dailyChallenge.reminderEnabled')} onChange={(v) => setValue('dailyChallenge.reminderEnabled', v, { shouldDirty: true })} />
      <Input type="time" label="Reminder Time" {...register('dailyChallenge.reminderTime')} />
      <Switch label="Streak Notifications" checked={watch('dailyChallenge.streakNotifications')} onChange={(v) => setValue('dailyChallenge.streakNotifications', v, { shouldDirty: true })} />
    </div>
  </Card>
);

export const ExamSettings = ({ watch, setValue }) => (
  <Card title={<div className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Exam Preferences</div>} description="Adjust your exam taking interface.">
    <div className="flex flex-col gap-4 mt-4">
      <Switch label="Show Exam Timer" checked={watch('exam.showTimer')} onChange={(v) => setValue('exam.showTimer', v, { shouldDirty: true })} />
      <Switch label="Show Question Number" checked={watch('exam.showQuestionNumber')} onChange={(v) => setValue('exam.showQuestionNumber', v, { shouldDirty: true })} />
      <Switch label="Confirm Before Starting Exam" checked={watch('exam.confirmBeforeStart')} onChange={(v) => setValue('exam.confirmBeforeStart', v, { shouldDirty: true })} />
      <Switch label="Auto Submit When Time Ends" checked={watch('exam.autoSubmit')} onChange={(v) => setValue('exam.autoSubmit', v, { shouldDirty: true })} />
      <Switch label="Warn Before Leaving Exam" checked={watch('exam.leaveWarning')} onChange={(v) => setValue('exam.leaveWarning', v, { shouldDirty: true })} />
      <Switch label="Remember Last Selected Language" checked={watch('exam.rememberLanguage')} onChange={(v) => setValue('exam.rememberLanguage', v, { shouldDirty: true })} />
    </div>
  </Card>
);

export const AccessibilitySettings = ({ register, watch, setValue }) => (
  <Card title={<div className="flex items-center gap-2"><Accessibility className="h-5 w-5 text-primary" /> Accessibility</div>} description="Make AdaptiveAI work better for you.">
    <div className="flex flex-col gap-4 mt-4">
      <Select
        label="Font Size"
        options={[{ value: 'Small', label: 'Small' }, { value: 'Medium', label: 'Medium' }, { value: 'Large', label: 'Large' }]}
        {...register('accessibility.fontSize')}
      />
      <Switch label="High Contrast Mode" checked={watch('accessibility.highContrast')} onChange={(v) => setValue('accessibility.highContrast', v, { shouldDirty: true })} />
      <Switch label="Reduce Motion" checked={watch('accessibility.reduceMotion')} onChange={(v) => setValue('accessibility.reduceMotion', v, { shouldDirty: true })} />
      <Switch label="Keyboard Navigation Enhancement" checked={watch('accessibility.keyboardNavigation')} onChange={(v) => setValue('accessibility.keyboardNavigation', v, { shouldDirty: true })} />
      <Switch label="Screen Reader Optimization" checked={watch('accessibility.screenReader')} onChange={(v) => setValue('accessibility.screenReader', v, { shouldDirty: true })} />
    </div>
  </Card>
);

export const SoundSettings = ({ watch, setValue }) => (
  <Card title={<div className="flex items-center gap-2"><Volume2 className="h-5 w-5 text-primary" /> Sound & Interaction</div>} description="Control audio feedback during learning.">
    <div className="flex flex-col gap-4 mt-4">
      <Switch label="Master Sound" checked={watch('sound.master')} onChange={(v) => setValue('sound.master', v, { shouldDirty: true })} />
      <Switch label="Correct Answer Sound" checked={watch('sound.correctAnswer')} onChange={(v) => setValue('sound.correctAnswer', v, { shouldDirty: true })} />
      <Switch label="Incorrect Answer Sound" checked={watch('sound.incorrectAnswer')} onChange={(v) => setValue('sound.incorrectAnswer', v, { shouldDirty: true })} />
      <Switch label="Challenge Completion Sound" checked={watch('sound.challengeCompletion')} onChange={(v) => setValue('sound.challengeCompletion', v, { shouldDirty: true })} />
      <Switch label="Notification Sound" checked={watch('sound.notification')} onChange={(v) => setValue('sound.notification', v, { shouldDirty: true })} />
    </div>
  </Card>
);

export const SecuritySettings = () => {
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [showSessionsModal, setShowSessionsModal] = React.useState(false);
  const [showActivityModal, setShowActivityModal] = React.useState(false);
  const [securityData, setSecurityData] = React.useState(null);
  const [isLoadingSecurity, setIsLoadingSecurity] = React.useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState('');
  const [passwordSuccess, setPasswordSuccess] = React.useState('');

  const fetchSecurity = async () => {
    setIsLoadingSecurity(true);
    try {
      const res = await (await import('../../services/apiClient')).default.get('/settings/security-overview');
      if (res.data?.success) {
        setSecurityData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load security overview:', err);
    } finally {
      setIsLoadingSecurity(false);
    }
  };

  React.useEffect(() => {
    fetchSecurity();
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const apiClient = (await import('../../services/apiClient')).default;
      const res = await apiClient.post('/settings/change-password', {
        currentPassword,
        newPassword
      });
      if (res.data?.success) {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setShowPasswordModal(false), 1500);
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm('Are you sure you want to log out of all other active sessions?')) {
      return;
    }
    try {
      const apiClient = (await import('../../services/apiClient')).default;
      await apiClient.post('/settings/logout-all');
      alert('All other devices have been logged out.');
      fetchSecurity();
    } catch (err) {
      alert('Failed to log out all sessions.');
    }
  };

  return (
    <>
      <Card title={<div className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Privacy & Security</div>} description="Manage your account security and authentication settings.">
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-sm text-text-secondary">
                {securityData?.hasPasswordSet ? '••••••••' : 'No password set (OAuth login)'}
              </p>
            </div>
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => {
                setPasswordError('');
                setPasswordSuccess('');
                setShowPasswordModal(true);
              }}
            >
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="text-sm font-medium">Active Sessions</p>
              <p className="text-sm text-text-secondary">
                {securityData?.sessions?.length || 1} device connected
              </p>
            </div>
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => {
                fetchSecurity();
                setShowSessionsModal(true);
              }}
            >
              Manage Sessions
            </Button>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="text-sm font-medium">Login Activity</p>
              <p className="text-sm text-text-secondary">
                Last login: {securityData?.lastLogin ? new Date(securityData.lastLogin).toLocaleDateString() : 'Today'}
              </p>
            </div>
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => {
                fetchSecurity();
                setShowActivityModal(true);
              }}
            >
              View Activity
            </Button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Account Security Status:</p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Secure
              </span>
            </div>
            <Button 
              type="button"
              variant="danger" 
              size="sm"
              onClick={handleLogoutAll}
            >
              Logout All
            </Button>
          </div>
        </div>
      </Card>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#0b1713] border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Change Account Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your current credentials and choose a secure new password.
            </p>

            {passwordError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="mb-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Current Password (optional for Google login)</label>
                <input 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">New Password (min 6 characters)</label>
                <input 
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm New Password</label>
                <input 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="sm"
                  isLoading={isChangingPassword}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Sessions Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#0b1713] border border-cyan-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">Active Sessions</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                1 Device Online
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Devices currently signed in to your AdaptiveAI account.
            </p>

            <div className="space-y-3 mb-6">
              {(securityData?.sessions || [{
                id: 'cur',
                device: 'Current Web Browser',
                ip: '127.0.0.1',
                isCurrent: true,
                location: 'Current Location'
              }]).map((sess, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{sess.device}</span>
                      {sess.isCurrent && (
                        <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-bold">
                          THIS DEVICE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      IP: {sess.ip} • {sess.location}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">Active now</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <Button 
                type="button" 
                variant="danger" 
                size="sm"
                onClick={handleLogoutAll}
              >
                Terminate Other Sessions
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setShowSessionsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Login Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#0b1713] border border-cyan-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Recent Security Activity</h3>
            <p className="text-xs text-slate-400 mb-4">
              Recent authentications, verified connections, and password changes.
            </p>

            <div className="space-y-2.5 mb-6 max-h-60 overflow-y-auto pr-1">
              {(securityData?.activities || [
                { id: '1', action: 'Account Login', timestamp: new Date(), status: 'Success' },
                { id: '2', action: 'Settings Verified', timestamp: new Date(), status: 'Success' }
              ]).map((act, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white block">{act.action}</span>
                    <span className="text-slate-400 text-[11px]">{new Date(act.timestamp).toLocaleString()}</span>
                  </div>
                  <span className="text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                    {act.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setShowActivityModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const DataPrivacySettings = () => {
  const [isExportingData, setIsExportingData] = React.useState(false);
  const [isExportingExams, setIsExportingExams] = React.useState(false);

  const handleDownloadLearningData = async () => {
    setIsExportingData(true);
    try {
      const apiClient = (await import('../../services/apiClient')).default;
      const res = await apiClient.get('/settings/export-learning-data');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AdaptiveAI_LearningData_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export learning data.');
    } finally {
      setIsExportingData(false);
    }
  };

  const handleExportExamHistory = async () => {
    setIsExportingExams(true);
    try {
      const apiClient = (await import('../../services/apiClient')).default;
      const res = await apiClient.get('/settings/export-exam-history');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AdaptiveAI_ExamHistory_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export exam history.');
    } finally {
      setIsExportingExams(false);
    }
  };

  const handleExportAnalytics = async () => {
    try {
      const apiClient = (await import('../../services/apiClient')).default;
      const res = await apiClient.get('/analytics/dashboard');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AdaptiveAI_Analytics_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export analytics data.');
    }
  };

  const handleClearTutorHistory = () => {
    if (window.confirm('Are you sure you want to clear your local AdaptiveAI Tutor chat history?')) {
      localStorage.removeItem('adaptiveAI_tutor_history');
      alert('AI conversation history cleared successfully!');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.prompt('WARNING: This action is permanent. Type "DELETE" to confirm account deletion:');
    if (confirmation === 'DELETE') {
      try {
        const apiClient = (await import('../../services/apiClient')).default;
        await apiClient.delete('/settings/delete-account');
        alert('Your account has been deleted.');
        localStorage.clear();
        window.location.href = '/login';
      } catch (err) {
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  return (
    <Card title={<div className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" /> Data & Privacy</div>} description="Export your performance data and manage your account privacy.">
      <div className="flex flex-col gap-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            type="button"
            variant="outline" 
            className="justify-start cursor-pointer hover:border-cyan-400"
            onClick={handleDownloadLearningData}
            isLoading={isExportingData}
          >
            <Download className="mr-2 h-4 w-4 text-cyan-400" /> Download My Learning Data
          </Button>
          <Button 
            type="button"
            variant="outline" 
            className="justify-start cursor-pointer hover:border-cyan-400"
            onClick={handleExportExamHistory}
            isLoading={isExportingExams}
          >
            <Download className="mr-2 h-4 w-4 text-cyan-400" /> Export Exam History
          </Button>
          <Button 
            type="button"
            variant="outline" 
            className="justify-start cursor-pointer hover:border-cyan-400"
            onClick={handleExportAnalytics}
          >
            <Download className="mr-2 h-4 w-4 text-cyan-400" /> Export Analytics
          </Button>
          <Button 
            type="button"
            variant="outline" 
            className="justify-start cursor-pointer hover:border-amber-400"
            onClick={handleClearTutorHistory}
          >
            <Trash2 className="mr-2 h-4 w-4 text-amber-400" /> Clear AI Conversation History
          </Button>
        </div>
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-red-500">Danger Zone</h4>
            <p className="text-xs text-slate-400">Permanently remove your account and all associated test records.</p>
          </div>
          <Button 
            type="button"
            variant="danger" 
            className="w-full sm:w-auto"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const VoiceSettings = ({ register, watch, setValue }) => (
  <Card title={<div className="flex items-center gap-2"><Mic className="h-5 w-5 text-primary" /> Voice & AI Tutor</div>} description="Configure voice interaction settings for the AI Tutor.">
    <div className="flex flex-col gap-4 mt-4">
      <Switch label="Voice Input" checked={watch('voice.inputEnabled') !== false} onChange={(v) => setValue('voice.inputEnabled', v, { shouldDirty: true })} />
      <Switch label="Auto-Speak Voice Responses" checked={watch('voice.responsesEnabled') !== false} onChange={(v) => setValue('voice.responsesEnabled', v, { shouldDirty: true })} />
      <Select
        label="Voice Language"
        options={[
          { value: 'en-US', label: 'English (US)' },
          { value: 'en-IN', label: 'English (India)' },
          { value: 'en-GB', label: 'English (UK)' },
          { value: 'hi-IN', label: 'Hindi (India)' },
          { value: 'bn-IN', label: 'Bengali (India)' }
        ]}
        {...register('voice.language')}
      />
    </div>
  </Card>
);
