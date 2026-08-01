import { Link } from 'react-router-dom';
import { LogOut, RefreshCw } from 'lucide-react';
import { ROUTES } from '../../../config/constants.js';

export function SessionExpiredPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
        <RefreshCw className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Session Expired</h1>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        Your authentication session has expired due to inactivity or token revocation. Please log in again to continue.
      </p>
      <Link
        to={ROUTES.LOGIN}
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
      >
        <LogOut className="w-4 h-4 mr-2" /> Re-authenticate
      </Link>
    </div>
  );
}

export default SessionExpiredPage;
