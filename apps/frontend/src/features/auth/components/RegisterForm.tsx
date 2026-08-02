import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, ShieldCheck } from 'lucide-react';
import { UserRole } from '@task-platform/shared';
import { Button } from '../../../components/ui/button.js';
import { Input } from '../../../components/ui/input.js';
import { FormFieldWrapper } from '../../../components/forms/FormFieldWrapper.js';
import { useAuthQueries } from '../hooks/useAuthQueries.js';
import { ROUTES } from '../../../config/constants.js';

const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const registerValidationSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        passwordComplexityRegex,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterSchemaType = z.infer<typeof registerValidationSchema>;

export function RegisterForm() {
  const { register: registerAccount, isRegistering } = useAuthQueries();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerValidationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false as unknown as true,
    },
  });

  const passwordValue = watch('password', '');

  // Password strength calculation
  const hasMinLen = passwordValue.length >= 8;
  const hasUpper = /[A-Z]/.test(passwordValue);
  const hasLower = /[a-z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecial = /[@$!%*?&]/.test(passwordValue);
  const strengthScore = [hasMinLen, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      await registerAccount({
        name: data.name,
        email: data.email,
        password: data.password,
        role: UserRole.USER,
      });
    } catch {
      // Handled by onError toast callback
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name Input */}
      <FormFieldWrapper label="Full Name" error={errors.name?.message} required>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            {...register('name')}
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            error={!!errors.name}
            className="pl-9 min-h-[44px]"
          />
        </div>
      </FormFieldWrapper>

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
            autoComplete="new-password"
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

      {/* Password Strength Indicator */}
      {passwordValue && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Password Strength:</span>
            <span className="font-semibold text-foreground">
              {strengthScore <= 2 ? 'Weak' : strengthScore <= 4 ? 'Good' : 'Strong'}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1 h-1.5">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-full rounded-full transition-colors ${
                  level <= strengthScore
                    ? strengthScore <= 2
                      ? 'bg-rose-500'
                      : strengthScore <= 4
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-muted-foreground pt-1">
            <span className={hasMinLen ? 'text-emerald-500 flex items-center gap-1' : ''}>
              ✓ Min 8 characters
            </span>
            <span className={hasUpper && hasLower ? 'text-emerald-500 flex items-center gap-1' : ''}>
              ✓ Upper & lowercase
            </span>
            <span className={hasNumber ? 'text-emerald-500 flex items-center gap-1' : ''}>
              ✓ At least 1 number
            </span>
            <span className={hasSpecial ? 'text-emerald-500 flex items-center gap-1' : ''}>
              ✓ Special character
            </span>
          </div>
        </div>
      )}

      {/* Confirm Password Input */}
      <FormFieldWrapper label="Confirm Password" error={errors.confirmPassword?.message} required>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            {...register('confirmPassword')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            className="pl-9 min-h-[44px]"
          />
        </div>
      </FormFieldWrapper>

      {/* Terms and Conditions Checkbox */}
      <FormFieldWrapper error={errors.termsAccepted?.message}>
        <label className="flex items-start gap-2 cursor-pointer text-xs text-muted-foreground select-none pt-1 min-h-[44px]">
          <input
            type="checkbox"
            {...register('termsAccepted')}
            className="rounded border-input text-primary focus:ring-primary h-4 w-4 mt-0.5"
          />
          <span>
            I agree to the{' '}
            <a href="#" className="text-primary font-medium hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary font-medium hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>
      </FormFieldWrapper>

      {/* Submit Button */}
      <Button type="submit" className="w-full font-semibold min-h-[44px]" isLoading={isRegistering}>
        <ShieldCheck className="w-4 h-4 mr-2" /> Create Enterprise Account
      </Button>

      {/* Login Link */}
      <div className="text-center text-xs text-muted-foreground pt-2">
        Already registered?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary font-semibold hover:underline">
          Sign in instead
        </Link>
      </div>
    </form>
  );
}
