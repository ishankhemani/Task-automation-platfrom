import { LoginForm } from '../components/LoginForm.js';

export function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Sign In</h2>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access the Task Automation Platform.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
