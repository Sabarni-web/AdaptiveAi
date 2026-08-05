import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { registerSchema } from '../utils/validators';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import clsx from 'clsx';

export const Register = () => {
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'Weak', color: 'bg-red-500' });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      terms: false,
    },
  });

  const passwordVal = watch('password', '');

  useEffect(() => {
    if (!passwordVal) {
      setPasswordStrength({ score: 0, text: 'Too Short', color: 'bg-slate-200' });
      return;
    }

    let score = 0;
    if (passwordVal.length >= 8) score += 1;
    if (passwordVal.length >= 12) score += 1;
    if (/[A-Z]/.test(passwordVal) && /[a-z]/.test(passwordVal)) score += 1;
    if (/[0-9]/.test(passwordVal)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordVal)) score += 1;

    let text = 'Weak';
    let color = 'bg-red-500';

    if (score >= 5) {
      text = 'Strong';
      color = 'bg-green-500';
    } else if (score >= 4) {
      text = 'Good';
      color = 'bg-blue-500';
    } else if (score >= 2) {
      text = 'Fair';
      color = 'bg-yellow-500';
    }

    setPasswordStrength({ score, text, color });
  }, [passwordVal]);

  const onSubmit = (data) => {
    registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-primary">
          Create account
        </h2>
        <p className="text-xs text-secondary">
          Get started with our intelligent adaptive testing platform today.
        </p>
      </div>

      <Input
        label="Full Name"
        placeholder="John Doe"
        error={errors.name?.message}
        iconLeft={<User className="h-4 w-4" />}
        {...register('name')}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        iconLeft={<Mail className="h-4 w-4" />}
        {...register('email')}
      />

      <Select
        label="I am a"
        options={[
          { value: 'student', label: 'Student' },
          { value: 'teacher', label: 'Teacher' },
        ]}
        error={errors.role?.message}
        {...register('role')}
      />

      <div className="flex flex-col gap-1.5">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min 8 characters"
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
        {passwordVal && (
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex justify-between text-[10px] font-semibold text-secondary">
              <span>Password strength:</span>
              <span className="font-bold">{passwordStrength.text}</span>
            </div>
            <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
              <div
                className={clsx('h-full transition-all duration-350', passwordStrength.color)}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Re-enter password"
        error={errors.confirmPassword?.message}
        iconLeft={<Lock className="h-4 w-4" />}
        {...register('confirmPassword')}
      />

      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 mt-0.5 rounded border-hair bg-surface-2 text-mint focus:ring-mint focus:ring-offset-void"
            {...register('terms')}
          />
          <span className="text-xs text-secondary font-medium select-none">
            I accept the{' '}
            <a href="#terms" className="text-mint hover:text-mint-dim hover:underline">
              Terms &amp; Conditions
            </a>
          </span>
        </label>
        {errors.terms && (
          <span className="text-xs text-red-500 font-medium">{errors.terms.message}</span>
        )}
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full mt-2">
        Create Account
      </Button>

      <p className="text-center text-xs text-secondary mt-2">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-mint hover:text-mint-dim hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};
