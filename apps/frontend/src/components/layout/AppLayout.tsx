import { Outlet } from 'react-router-dom';
import { Header } from './Header.js';
import { Sidebar } from './Sidebar.js';
import { ErrorBoundary } from '../feedback/ErrorBoundary.js';
import { useAppSelector } from '../../store/index.js';
import { cn } from '../../lib/utils.js';

export function AppLayout() {
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      <Header />
      <div className="flex flex-1 relative">
        <Sidebar />
        <main
          className={cn(
            'flex-1 p-3 sm:p-4 md:p-6 lg:p-8 transition-all duration-300 min-h-[calc(100vh-4rem)] max-w-full overflow-x-hidden',
            sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
          )}
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
