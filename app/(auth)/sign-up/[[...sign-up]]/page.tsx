"use client";

import { ClerkProvider, SignUp } from "@clerk/nextjs";

const clerkPublishableKey =
  "pk_test_cmFwaWQtc2VydmFsLTk2LmNsZXJrLmFjY291bnRzLmRldiQ";

export default function Page() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </ClerkProvider>
  );
}