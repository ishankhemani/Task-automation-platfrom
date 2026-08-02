import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '../feedback/ErrorBoundary.js';

export function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-3 sm:p-4 relative overflow-hidden">
      {/* Dynamic Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            TaskAutomation
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Enterprise Distributed Job Processing Platform
          </p>
        </div>

        <div className="bg-card border border-border shadow-xl rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-sm">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
