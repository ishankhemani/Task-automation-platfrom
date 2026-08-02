import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, CheckSquare, Layers, BarChart3, Users, Settings, User, X } from 'lucide-react';
import { ROUTES } from '../../config/constants.js';
import { modalVariants } from '../../lib/animations.js';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const COMMAND_ITEMS: CommandItem[] = [
  { id: '1', title: 'Dashboard Overview', category: 'Platform', icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { id: '2', title: 'Tasks Management', category: 'Platform', icon: CheckSquare, path: ROUTES.TASKS },
  { id: '3', title: 'Queue & Workers', category: 'Platform', icon: Layers, path: ROUTES.QUEUES },
  { id: '4', title: 'System Analytics', category: 'Platform', icon: BarChart3, path: ROUTES.ANALYTICS },
  { id: '5', title: 'User Management', category: 'Admin', icon: Users, path: ROUTES.ADMIN_USERS },
  { id: '6', title: 'User Profile', category: 'Account', icon: User, path: ROUTES.PROFILE },
  { id: '7', title: 'Application Settings', category: 'Account', icon: Settings, path: ROUTES.SETTINGS },
];

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems = COMMAND_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : setQuery('');
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
      } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
        e.preventDefault();
        navigate(filteredItems[selectedIndex].path);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 sm:pt-20 px-2 sm:px-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden glass-panel max-h-[85vh] flex flex-col"
        >
          {/* Search Header */}
          <div className="flex items-center px-3 sm:px-4 py-3 border-b border-border gap-2 sm:gap-3">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none min-h-[38px]"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1 flex-1">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No matching commands found.
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors text-left min-h-[44px] ${
                      isSelected
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {item.category}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-muted/40 text-xs text-muted-foreground border-t border-border">
            <div className="hidden sm:flex items-center gap-2">
              <span>Navigate: <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↓</kbd></span>
              <span>Select: <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">↵</kbd></span>
            </div>
            <span className="sm:hidden text-[11px]">Tap command to launch</span>
            <span>Close: <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">ESC</kbd></span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
