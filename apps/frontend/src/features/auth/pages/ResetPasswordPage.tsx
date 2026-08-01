import { ResetPasswordForm } from '../components/ResetPasswordForm.js';

export function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Set New Password</h2>
        <p className="text-sm text-muted-foreground">
          Enter your new credentials below to restore access to your account.
        </p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}

export default ResetPasswordPage;
