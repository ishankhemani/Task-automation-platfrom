import { ForgotPasswordForm } from '../components/ForgotPasswordForm.js';

export function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Forgot Password</h2>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}

export default ForgotPasswordPage;
