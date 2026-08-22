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

export const SecuritySettings = () => (
  <Card title={<div className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Privacy & Security</div>} description="Manage your account security.">
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between py-2 border-b border-border">
        <div>
          <p className="text-sm font-medium">Password</p>
          <p className="text-sm text-text-secondary">••••••••</p>
        </div>
        <Button variant="outline" size="sm">Change Password</Button>
      </div>
      <div className="flex items-center justify-between py-2 border-b border-border">
        <div>
          <p className="text-sm font-medium">Active Sessions</p>
          <p className="text-sm text-text-secondary">1 device</p>
        </div>
        <Button variant="outline" size="sm">Manage Sessions</Button>
      </div>
      <div className="flex items-center justify-between py-2 border-b border-border">
        <div>
          <p className="text-sm font-medium">Login Activity</p>
          <p className="text-sm text-text-secondary">Last login: Today</p>
        </div>
        <Button variant="outline" size="sm">View Activity</Button>
      </div>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Account Security Status:</p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Secure
          </span>
        </div>
        <Button variant="danger" size="sm">Logout All</Button>
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

export const SecuritySettings = () => (
  <Card title={<div className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Privacy & Security</div>} description="Manage your account security.">
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between py-2 border-b border-border">
        <div>
          <p className="text-sm font-medium">Password</p>
          <p className="text-sm text-text-secondary">••••••••</p>
        </div>
        <Button variant="outline" size="sm">Change Password</Button>
      </div>
      <div className="flex items-center justify-between py-2 border-b border-border">
        <div>
          <p className="text-sm font-medium">Active Sessions</p>
          <p className="text-sm text-text-secondary">1 device</p>
        </div>
        <Button variant="outline" size="sm">Manage Sessions</Button>
      </div>
      <div className="flex items-center justify-between py-2 border-b border-border">
        <div>
          <p className="text-sm font-medium">Login Activity</p>
          <p className="text-sm text-text-secondary">Last login: Today</p>
        </div>
        <Button variant="outline" size="sm">View Activity</Button>
      </div>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Account Security Status:</p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Secure
          </span>
        </div>
        <Button variant="danger" size="sm">Logout All</Button>
      </div>
    </div>
  </Card>
);

export const DataPrivacySettings = () => (
  <Card title={<div className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" /> Data & Privacy</div>} description="Manage your data and account.">
    <div className="flex flex-col gap-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" className="justify-start"><Download className="mr-2 h-4 w-4" /> Download My Learning Data</Button>
        <Button variant="outline" className="justify-start"><Download className="mr-2 h-4 w-4" /> Export Exam History</Button>
        <Button variant="outline" className="justify-start"><Download className="mr-2 h-4 w-4" /> Export Analytics</Button>
        <Button variant="outline" className="justify-start"><Trash2 className="mr-2 h-4 w-4" /> Clear AI Conversation History</Button>
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-red-500 mb-2">Danger Zone</h4>
        <Button variant="danger" className="w-full sm:w-auto">Delete Account</Button>
      </div>
    </div>
  </Card>
);

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
