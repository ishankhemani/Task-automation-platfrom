import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profileApi.js';
import { FileUploader } from '../../../components/common/FileUploader.js';
import { User, Shield, Key, Clock, Save, UserCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../hooks/useAuth.js';

export const ProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user: authUser } = useAuth();

  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getProfile(),
  });

  const user = profileResponse?.data || authUser;

  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState<string | null>(null);

  // Sync state when user profile loads
  React.useEffect(() => {
    if (profileResponse?.data) {
      setName(profileResponse.data.name || '');
      setAvatarUrl(profileResponse.data.avatar || '');
    }
  }, [profileResponse]);

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string; avatar?: string }) => profileApi.updateProfile(data),
    onSuccess: () => {
      toast.success('Profile details updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(msg);
    },
  });

  // Change Password Mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      profileApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPassError(null);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to change password';
      setPassError(msg);
      toast.error(msg);
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    updateProfileMutation.mutate({ name, avatar: avatarUrl });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (!currentPassword) {
      setPassError('Current password is required');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Passwords do not match');
      return;
    }

    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Banner */}
      <div className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user?.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-extrabold border-4 border-primary/20">
              {user?.name?.substring(0, 2).toUpperCase() || 'US'}
            </div>
          )}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{user?.name}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20 uppercase">
              {user?.role}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Account Active
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Card */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2 rounded-lg border border-border bg-muted/50 text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <FileUploader
                label="Profile Avatar"
                currentValue={avatarUrl}
                allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
                onUploadSuccess={(url) => setAvatarUrl(url)}
                acceptText="Upload profile image (JPG, PNG, WEBP)"
              />
            </div>

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Key className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Security & Password</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
              />
            </div>

            {passError && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {passError}
              </p>
            )}

            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="w-full py-2.5 px-4 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              <Shield className="w-4 h-4" />
              {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
