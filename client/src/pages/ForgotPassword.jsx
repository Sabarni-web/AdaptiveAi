import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema } from '../utils/validators';
import authService from '../services/authService';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { toast } from 'sonner';

export const ForgotPassword = () => {
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSent(true);
      toast.success('Reset email sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="flex flex-col gap-5 text-center items-center py-4">
        <CheckCircle2 className="h-14 w-14 text-green-500 stroke-[1.5]" />
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-primary">Check your email</h3>
          <p className="text-xs text-secondary max-w-xs mx-auto leading-relaxed">
            If an account is associated with that address, we have sent instructions to reset your password.
          </p>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-xs font-bold text-mint hover:text-mint-dim hover:underline mt-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to sign in</span>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-primary">
          Reset password
        </h2>
        <p className="text-xs text-secondary">
          Enter your email and we'll send you instructions to reset your password.
        </p>
      </div>

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        iconLeft={<Mail className="h-4 w-4" />}
        {...register('email')}
        autoFocus
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Send Reset Link
      </Button>

      <Link
        to="/login"
        className="flex items-center justify-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to sign in</span>
      </Link>
    </form>
  );
};
