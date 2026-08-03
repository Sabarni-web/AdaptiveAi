import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { resetPasswordSchema } from '../utils/validators';
import authService from '../services/authService';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { toast } from 'sonner';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword(token, data.password);
      toast.success('Password updated successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Create new password
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter your new password below. Ensure it's at least 8 characters.
        </p>
      </div>

      <Input
        label="New Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        error={errors.password?.message}
        iconLeft={<Lock className="h-4 w-4" />}
        iconRight={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="focus:outline-none hover:text-slate-700 dark:hover:text-slate-350"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        {...register('password')}
        autoFocus
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        iconLeft={<Lock className="h-4 w-4" />}
        {...register('confirmPassword')}
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Reset Password
      </Button>

      <Link
        to="/login"
        className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to sign in</span>
      </Link>
    </form>
  );
};
