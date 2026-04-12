"use client";

import { ClerkProvider, SignIn } from "@clerk/nextjs";

const clerkPublishableKey =
  "pk_test_cmFwaWQtc2VydmFsLTk2LmNsZXJrLmFjY291bnRzLmRldiQ";

export default function Page() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </ClerkProvider>
  );
}