'use client';
import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/auth'; // আপনার পাথ অনুযায়ী
import { Mail, User as UserIcon } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);

        // window.location.href = '/login';
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-[var(--muted)] text-sm">
          <span className="w-4 h-4 border-2 border-[var(--border-color)] border-t-[var(--accent)] rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[var(--ink)] font-medium mb-1">Couldn't load your profile</p>
          <p className="text-sm text-[var(--muted)]">Please try logging in again.</p>
        </div>
      </div>
    );
  }

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-[family-name:var(--font-display)] font-semibold text-[var(--ink)] mb-6">
        Dashboard
      </h1>

      <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xl font-semibold shrink-0">
            {initial}
          </div>
          <div>
            <p className="text-lg font-semibold text-[var(--ink)]">
              Welcome back, {user?.name}!
            </p>
            <p className="text-sm text-[var(--muted)]">Here's your account overview</p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3 text-sm">
            <UserIcon className="w-4 h-4 text-[var(--muted)] shrink-0" />
            <span className="text-[var(--muted)] w-16">Name</span>
            <span className="text-[var(--ink)] font-medium">{user?.name}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-[var(--muted)] shrink-0" />
            <span className="text-[var(--muted)] w-16">Email</span>
            <span className="text-[var(--ink)] font-medium">{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}