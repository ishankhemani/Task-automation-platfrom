import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/button.js';
import { Input } from '../../../components/ui/input.js';
import { FormFieldWrapper } from '../../../components/forms/FormFieldWrapper.js';
import { useAuthQueries } from '../hooks/useAuthQueries.js';
import { ROUTES } from '../../../config/constants.js';

const loginValidationSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginSchemaType = z.infer<typeof loginValidationSchema>;

export function LoginForm() {
  const { login, isLoggingIn } = useAuthQueries();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleQuickLogin = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
    login({ email, password: pass });
  };

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await login({ email: data.email, password: data.password });
    } catch {
      // Error handled by mutation onError callback
    }
  };

  return (
    <div className="space-y-4">
      {/* Preset Quick Login Buttons */}
      <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
        <p className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>⚡ Preset System Credentials</span>
          <span className="text-[10px] text-muted-foreground">Click to log in</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@taskplatform.com', 'Admin123!')}
            className="px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold text-left transition-colors flex flex-col"
          >
            <span>👑 Preset Admin</span>
            <span className="text-[10px] font-normal opacity-80 truncate">admin@taskplatform.com</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('user@taskplatform.com', 'User123!')}
            className="px-2.5 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold text-left transition-colors flex flex-col"
          >
            <span>👤 Standard User</span>
            <span className="text-[10px] font-normal opacity-80 truncate">user@taskplatform.com</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input */}
        <FormFieldWrapper label="Email Address" error={errors.email?.message} required>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              {...register('email')}
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              error={!!errors.email}
              className="pl-9 min-h-[44px]"
            />
          </div>
        </FormFieldWrapper>

        {/* Password Input */}
        <FormFieldWrapper label="Password" error={errors.password?.message} required>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              error={!!errors.password}
              className="pl-9 pr-10 min-h-[44px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </FormFieldWrapper>

        {/* Remember Me & Forgot Password Links */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground select-none min-h-[40px]">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="rounded border-input text-primary focus:ring-primary h-4 w-4"
            />
            <span>Remember preference</span>
          </label>

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-primary font-medium hover:underline transition-all min-h-[40px] flex items-center"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full font-semibold min-h-[44px]" isLoading={isLoggingIn}>
          Sign In to Platform <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        {/* Register Redirect Prompt */}
        <div className="text-center text-xs text-muted-foreground pt-2">
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.REGISTER} className="text-primary font-semibold hover:underline">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
}
