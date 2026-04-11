'use client';

// app/(auth)/login/page.tsx
// Login page: email/password + magic link option.
// On success: redirects to /dashboard or the redirectTo param.

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Mode = 'password' | 'magic_link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';

  const [mode, setMode] = useState<Mode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMagicLinkSent(true);
    setLoading(false);
  }

  if (magicLinkSent) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
        <div className="text-2xl mb-2">✉️</div>
        <h2 className="text-lg font-medium text-stone-800 mb-2">Check your email</h2>
        <p className="text-stone-500 text-sm">
          We sent a sign-in link to <strong>{email}</strong>.
          Click the link in the email to continue.
        </p>
        <button
          onClick={() => setMagicLinkSent(false)}
          className="mt-4 text-sm text-[#4A7C6F] hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
      {/* Mode toggle */}
      <div className="flex rounded-lg border border-stone-200 p-1 mb-6">
        {(['password', 'magic_link'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(null); }}
            className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${
              mode === m
                ? 'bg-[#2D4A3E] text-white'
                : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            {m === 'password' ? 'Password' : 'Magic link'}
          </button>
        ))}
      </div>

      <form onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicLink}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          {mode === 'password' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D4A3E] text-white rounded-lg py-2.5 text-sm font-medium
                       hover:bg-[#4A7C6F] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Please wait…'
              : mode === 'password'
              ? 'Sign in'
              : 'Send magic link'}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-stone-500">
        No account?{' '}
        <Link href="/register" className="text-[#2D4A3E] hover:underline font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}
