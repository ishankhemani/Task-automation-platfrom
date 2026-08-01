import { RegisterForm } from '../components/RegisterForm.js';

export function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Create Account</h2>
        <p className="text-sm text-muted-foreground">
          Set up your organization account for distributed task execution.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
