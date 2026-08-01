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
  email: z.string().email('Please enter a valid email address'),
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
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await login({ email: data.email, password: data.password });
    } catch {
      // Error handled by mutation onError callback
    }
  };

  return (
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
            className="pl-9"
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
            className="pl-9 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </FormFieldWrapper>

      {/* Remember Me & Forgot Password Links */}
      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground select-none">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
          />
          <span>Remember preference</span>
        </label>

        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="text-primary font-medium hover:underline transition-all"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full font-semibold" isLoading={isLoggingIn}>
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
  );
}
