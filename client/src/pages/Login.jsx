import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginSchema } from '../utils/validators';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const Login = () => {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data) => {
    login(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-primary">
          Welcome back
        </h2>
        <p className="text-xs text-secondary">
          Please enter your details to sign in to your account.
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

      <div className="flex flex-col gap-1.5">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message}
          iconLeft={<Lock className="h-4 w-4" />}
          iconRight={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...register('password')}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-hair bg-surface-2 text-mint focus:ring-mint focus:ring-offset-void"
          />
          <span className="text-xs text-secondary font-medium select-none">
            Remember me
          </span>
        </label>
        <Link
          to="/forgot-password"
          className="text-xs font-semibold text-mint hover:text-mint-dim hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        Sign In
      </Button>

      <div className="relative flex items-center justify-center my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-hair" />
        </div>
        <span className="relative bg-surface px-3 text-[10px] uppercase font-bold text-secondary">
          Or continue with
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="flex items-center gap-2">
          <svg className="h-4 w-4 text-red-500 fill-current" viewBox="0 0 24 24">
            <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.55-4.46 10.55-10.715 0-.727-.08-1.282-.178-1.71H12.24z"/>
          </svg>
          <span>Google</span>
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>GitHub</span>
        </Button>
      </div>

      <p className="text-center text-xs text-secondary mt-2">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-mint hover:text-mint-dim hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
};
