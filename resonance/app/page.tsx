// app/page.tsx
// Root route — redirects based on Clerk auth state.

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default function RootPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  redirect('/dashboard');
}
