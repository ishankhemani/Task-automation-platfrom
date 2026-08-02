import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Button } from '../../../components/ui/button.js';
import { Input } from '../../../components/ui/input.js';
import { FormFieldWrapper } from '../../../components/forms/FormFieldWrapper.js';
import { useAuthQueries } from '../hooks/useAuthQueries.js';
import { ROUTES } from '../../../config/constants.js';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { forgotPassword, isForgotSending } = useAuthQueries();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    try {
      await forgotPassword(data.email);
    } catch {
      // Handled by mutation toast error
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Check Your Email</h3>
        <p className="text-sm text-muted-foreground">
          If an account exists with that email address, we have sent instructions to reset your password.
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter the email associated with your account and we&apos;ll send you a password reset link.
      </p>

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

      <Button type="submit" className="w-full font-semibold min-h-[44px]" isLoading={isForgotSending}>
        <Send className="w-4 h-4 mr-2" /> Send Reset Link
      </Button>

      <div className="text-center pt-2">
        <Link to={ROUTES.LOGIN} className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground font-medium min-h-[40px]">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Sign In
        </Link>
      </div>
    </form>
  );
}
