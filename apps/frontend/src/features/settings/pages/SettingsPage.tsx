import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme.js';
import { Sun, Moon, Monitor, Bell, Radio, CheckCircle, Database, Cpu, Volume2, VolumeX, Save } from 'lucide-react';
import { toast } from 'sonner';

const PREFS_KEY = 'taskplatform:settings';

interface UserPrefs {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  autoRefresh: boolean;
}

function loadPrefs(): UserPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw) as UserPrefs;
  } catch {}
  return { notificationsEnabled: true, soundEnabled: true, autoRefresh: true };
}

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => loadPrefs().notificationsEnabled);
  const [soundEnabled, setSoundEnabled] = useState(() => loadPrefs().soundEnabled);
  const [autoRefresh, setAutoRefresh] = useState(() => loadPrefs().autoRefresh);
  const [saved, setSaved] = useState(false);

  // Persist to localStorage whenever any preference changes
  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ notificationsEnabled, soundEnabled, autoRefresh }));
  }, [notificationsEnabled, soundEnabled, autoRefresh]);

  const handleSavePreferences = () => {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ notificationsEnabled, soundEnabled, autoRefresh }));
    setSaved(true);
    toast.success('System preferences saved successfully!');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Application Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your workspace preferences, theme mode, and notification behavior.</p>
      </div>

      {/* Theme Settings Card */}
      <div className="p-4 sm:p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
          <Monitor className="w-5 h-5 text-primary" /> Appearance Mode
        </h2>
        <p className="text-xs text-muted-foreground">Select your visual theme preference for the dashboard interface.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'light'
                ? 'border-primary bg-primary/10 text-primary shadow-sm'
                : 'border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}
          >
            <Sun className="w-6 h-6" />
            <span className="text-xs font-semibold">Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'dark'
                ? 'border-primary bg-primary/10 text-primary shadow-sm'
                : 'border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}
          >
            <Moon className="w-6 h-6" />
            <span className="text-xs font-semibold">Dark Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'system'
                ? 'border-primary bg-primary/10 text-primary shadow-sm'
                : 'border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}
          >
            <Monitor className="w-6 h-6" />
            <span className="text-xs font-semibold">System Default</span>
          </button>
        </div>
      </div>

      {/* Real-time Notifications & Sockets Card */}
      <div className="p-4 sm:p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" /> Real-time Notifications & WebSockets
        </h2>

        <div className="space-y-3 divide-y divide-border">
          <div className="flex items-center justify-between gap-3 pt-3">
            <div className="pr-2">
              <p className="text-xs sm:text-sm font-medium text-foreground">In-App Toast Alerts</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Receive instant popups when tasks transition between queue states.</p>
            </div>
            <button
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ${
                notificationsEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  notificationsEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 pt-3">
            <div className="pr-2">
              <p className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1.5">
                {soundEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />} Sound Effects
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Play a subtle chime sound when a BullMQ job completes or fails.</p>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ${
                soundEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  soundEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 pt-3">
            <div className="pr-2">
              <p className="text-xs sm:text-sm font-medium text-foreground">Auto-Refresh Dashboard Charts</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Automatically re-fetch queue throughput and active worker counts every 10 seconds.</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ${
                autoRefresh ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  autoRefresh ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Environment & System Information Card */}
      <div className="p-4 sm:p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" /> System Architecture Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-3 rounded-lg border border-border bg-background/50 flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1.5 truncate">
              <Radio className="w-4 h-4 text-emerald-500 shrink-0" /> Socket.IO Connection
            </span>
            <span className="font-semibold text-emerald-500 flex items-center gap-1 shrink-0">
              <CheckCircle className="w-3.5 h-3.5" /> Connected
            </span>
          </div>

          <div className="p-3 rounded-lg border border-border bg-background/50 flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1.5 truncate">
              <Cpu className="w-4 h-4 text-primary shrink-0" /> BullMQ Engine
            </span>
            <span className="font-semibold text-foreground shrink-0">Redis Cluster</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSavePreferences}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};
