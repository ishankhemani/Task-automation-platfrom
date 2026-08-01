import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../../config/constants.js';

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-foreground mb-2">403 — Unauthorized Access</h1>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        You do not have the required permissions or role privileges to access this area of the platform.
      </p>
      <Link
        to={ROUTES.DASHBOARD}
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
      </Link>
    </div>
  );
}

export default UnauthorizedPage;
