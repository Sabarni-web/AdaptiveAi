import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settingsService';
import { toast } from 'sonner';

export const useSettings = () => {
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings) => settingsService.updateSettings(newSettings),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(['settings'], updatedSettings);
      toast.success('Settings saved successfully');
    },
    onError: (err) => {
      console.error('Failed to save settings:', err);
      toast.error('Unable to save settings.');
    },
  });

  return {
    settings: settings || {},
    isLoading,
    isError,
    error,
    updateSettings: updateSettingsMutation.mutate,
    updateSettingsAsync: updateSettingsMutation.mutateAsync,
    isSaving: updateSettingsMutation.isPending,
  };
};
