import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, ArrowLeft, KeyRound } from 'lucide-react';
import { Button } from '../../../components/ui/button.js';
import { Input } from '../../../components/ui/input.js';
import { FormFieldWrapper } from '../../../components/forms/FormFieldWrapper.js';
import { useAuthQueries } from '../hooks/useAuthQueries.js';
import { ROUTES } from '../../../config/constants.js';

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is missing or invalid'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const { resetPassword, isResetting } = useAuthQueries();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenFromUrl,
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    try {
      await resetPassword({
        token: data.token,
        newPassword: data.newPassword,
      });
    } catch {
      // Handled by onError toast callback
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Token Input (Hidden if token provided in URL) */}
      {!tokenFromUrl && (
        <FormFieldWrapper label="Reset Token" error={errors.token?.message} required>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              {...register('token')}
              type="text"
              placeholder="Paste token from email..."
              error={!!errors.token}
              className="pl-9"
            />
          </div>
        </FormFieldWrapper>
      )}

      {/* New Password */}
      <FormFieldWrapper label="New Password" error={errors.newPassword?.message} required>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            {...register('newPassword')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            error={!!errors.newPassword}
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

      {/* Confirm Password */}
      <FormFieldWrapper label="Confirm New Password" error={errors.confirmPassword?.message} required>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            {...register('confirmPassword')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            className="pl-9"
          />
        </div>
      </FormFieldWrapper>

      <Button type="submit" className="w-full font-semibold" isLoading={isResetting}>
        Reset Password
      </Button>

      <div className="text-center pt-2">
        <Link to={ROUTES.LOGIN} className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground font-medium">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Sign In
        </Link>
      </div>
    </form>
  );
}
