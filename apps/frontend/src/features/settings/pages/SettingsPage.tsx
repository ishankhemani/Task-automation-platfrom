import React, { useState } from 'react';
import { useTheme } from '../../../hooks/useTheme.js';
import { Sun, Moon, Monitor, Bell, Radio, CheckCircle, Database, Cpu, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleSavePreferences = () => {
    toast.success('System preferences saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Application Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your workspace preferences, theme mode, and notification behavior.</p>
      </div>

      {/* Theme Settings Card */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Monitor className="w-5 h-5 text-primary" /> Appearance Mode
        </h2>
        <p className="text-xs text-muted-foreground">Select your visual theme preference for the dashboard interface.</p>

        <div className="grid grid-cols-3 gap-4 pt-2">
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
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" /> Real-time Notifications & WebSockets
        </h2>

        <div className="space-y-3 divide-y divide-border">
          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-medium text-foreground">In-App Toast Alerts</p>
              <p className="text-xs text-muted-foreground">Receive instant popups when tasks transition between queue states.</p>
            </div>
            <button
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
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

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                {soundEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />} Sound Effects
              </p>
              <p className="text-xs text-muted-foreground">Play a subtle chime sound when a BullMQ job completes or fails.</p>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
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

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-medium text-foreground">Auto-Refresh Dashboard Charts</p>
              <p className="text-xs text-muted-foreground">Automatically re-fetch queue throughput and active worker counts every 10 seconds.</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
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
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" /> System Architecture Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 rounded-lg border border-border bg-background/50 flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-500" /> Socket.IO Connection
            </span>
            <span className="font-semibold text-emerald-500 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Connected
            </span>
          </div>

          <div className="p-3.5 rounded-lg border border-border bg-background/50 flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-primary" /> BullMQ Engine
            </span>
            <span className="font-semibold text-foreground">Redis Cluster</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSavePreferences}
          className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
