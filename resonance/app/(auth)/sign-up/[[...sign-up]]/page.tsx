// app/(auth)/sign-up/[[...sign-up]]/page.tsx
// Clerk hosted sign-up component.

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex justify-center">
      <SignUp />
    </div>
  );
}
