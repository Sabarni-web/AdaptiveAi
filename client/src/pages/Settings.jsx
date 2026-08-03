import React from 'react';
import { useForm } from 'react-hook-form';
import { useTheme } from '../hooks/useTheme';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { toast } from 'sonner';

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      theme: theme || 'light',
    },
  });

  const onSubmit = (data) => {
    toggleTheme(data.theme);
    toast.success('System settings updated successfully!');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        title="System Settings"
        description="Configure platform preferences and system features."
      />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card title="Appearance & Preferences" description="Configure visual appearance themes and display features.">
            <div className="flex flex-col gap-5 mt-4">
              <Select
                label="Visual Appearance Theme"
                options={[
                  { value: 'light', label: 'Light mode' },
                  { value: 'dark', label: 'Dark mode' },
                  { value: 'system', label: 'System Default' },
                ]}
                {...register('theme')}
              />

              <div className="flex justify-end border-t border-slate-100 dark:border-slate-700 pt-5 mt-2">
                <Button type="submit">Save Settings</Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};
export default Settings;
