// app/(auth)/sign-in/[[...sign-in]]/page.tsx
// Clerk hosted sign-in component.
// Clerk handles all auth UI, session management, and redirects.

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex justify-center">
      <SignIn />
    </div>
  );
}
