import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { updateUser } from '../redux/slices/authSlice';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { toast } from 'sonner';

export const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { theme, toggleTheme } = useTheme();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      theme: theme || 'light',
    },
  });

  const onSubmit = (data) => {
    dispatch(updateUser({ name: data.name, email: data.email }));
    toggleTheme(data.theme);
    toast.success('Settings updated successfully!');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        title="Settings"
        description="Update your profile information and customize platform preferences."
      />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card title="Profile Preferences" description="Configure account details and appearance themes.">
            <div className="flex flex-col gap-5 mt-4">
              <Input
                label="Full Name"
                placeholder="Name"
                {...register('name', { required: true })}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                {...register('email', { required: true })}
              />

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
