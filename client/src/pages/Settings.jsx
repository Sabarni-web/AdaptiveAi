import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTheme } from '../hooks/useTheme';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { useSettings } from '../hooks/useSettings';
import { SettingsSummary, AppearanceSettings, AiLearningSettings, StudySettings, NotificationSettings, DailyChallengeSettings, ExamSettings, AccessibilitySettings, SoundSettings, SecuritySettings, DataPrivacySettings, VoiceSettings } from '../components/settings/SettingsComponents';
import { Save, RotateCcw } from 'lucide-react';

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { settings, isLoading, updateSettings, isSaving } = useSettings();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { register, handleSubmit, watch, setValue, reset, formState: { isDirty } } = useForm({
    defaultValues: settings || { appearance: { theme: theme || 'dark' } },
  });

  // Sync form with settings query data
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      reset(settings);
    }
  }, [settings, reset]);

  // Sync theme
  useEffect(() => {
    const currentTheme = watch('appearance.theme');
    if (currentTheme && currentTheme !== theme) {
      toggleTheme(currentTheme);
    }
  }, [watch('appearance.theme')]);

  // Unsaved changes warning
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const onSubmit = (data) => {
    updateSettings({ preferences: data }, {
      onSuccess: () => {
        reset(data); // reset form to new clean state
      }
    });
  };

  const handleReset = () => {
    if (window.confirm("Reset all preferences to their default values?")) {
      // Typically we'd call an endpoint or just pass default object. For now we just reload from server.
      reset(settings);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader /></div>;
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-24">
      <PageHeader
        title="Settings Center"
        description="Personalize your AdaptiveAI experience."
      />

      <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row gap-6 relative">
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-6 w-full">
          <SettingsSummary settings={watch()} />
          
          <AppearanceSettings register={register} watch={watch} setValue={setValue} />
          <AiLearningSettings register={register} watch={watch} setValue={setValue} />
          <StudySettings register={register} watch={watch} setValue={setValue} />
          <NotificationSettings watch={watch} setValue={setValue} />
          <DailyChallengeSettings register={register} watch={watch} setValue={setValue} />
          <ExamSettings watch={watch} setValue={setValue} />
          <AccessibilitySettings register={register} watch={watch} setValue={setValue} />
          <SoundSettings watch={watch} setValue={setValue} />
          <VoiceSettings register={register} watch={watch} setValue={setValue} />
          <SecuritySettings />
          <DataPrivacySettings />

          {/* Sticky action bar */}
          <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-surface/80 backdrop-blur-md border-t border-border p-4 flex justify-between items-center z-50 shadow-lg">
            <div className="flex items-center gap-4">
              <Button type="button" variant="outline" onClick={handleReset} disabled={isSaving}>
                <RotateCcw className="w-4 h-4 mr-2" /> Reset Defaults
              </Button>
            </div>
            <div className="flex items-center gap-4">
              {hasUnsavedChanges && <span className="text-sm text-yellow-500 hidden md:inline">Unsaved changes</span>}
              <Button type="submit" variant="primary" disabled={isSaving || !hasUnsavedChanges} isLoading={isSaving}>
                <Save className="w-4 h-4 mr-2" /> Save Settings
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
