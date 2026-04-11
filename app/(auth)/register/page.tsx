'use client';

// app/(auth)/register/page.tsx
// Registration: email + password.
// On success: creates Supabase auth user, then calls profile.create (Sprint 1).
// Redirects to /onboarding/welcome.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // After email confirmation, redirect to onboarding
        emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=/onboarding/welcome`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Supabase sends a confirmation email by default.
    // Redirect to a "check your email" holding page.
    router.push('/register/confirm');
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
      <h2 className="text-lg font-medium text-stone-800 mb-1">Begin your journey</h2>
      <p className="text-sm text-stone-500 mb-6">
        Create your account to get started.
      </p>

      <form onSubmit={handleRegister}>
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent"
              placeholder="At least 8 characters"
            />
          </div>

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
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-stone-500">
        Already have an account?{' '}
        <Link href="/login" className="text-[#2D4A3E] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
