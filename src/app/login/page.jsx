'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
     
      await loginUser({ email, password });
      
     
      router.push('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface-alt)] px-4">
      <div className="w-full max-w-md bg-[var(--surface)] rounded-lg shadow-md p-8 border border-[var(--border-color)]">
        <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-center text-[var(--ink)] mb-6">
          Login to Your Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-950/40 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-[var(--border-color)] bg-[var(--surface-alt)] text-[var(--ink)] rounded-md outline-none transition-colors focus:border-[var(--accent)]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-[var(--border-color)] bg-[var(--surface-alt)] text-[var(--ink)] rounded-md outline-none transition-colors focus:border-[var(--accent)]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--ink)] text-[var(--surface-alt)] py-2 px-4 rounded-md hover:opacity-85 transition-opacity font-medium disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          Don't have an account?{' '}
          <a href="/register" className="text-[var(--accent)] hover:underline font-medium">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}