import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Resonance",
  description: "A guided relational development journey.",
};

const clerkPublishableKey =
  "pk_test_cmFwaWQtc2VydmFsLTk2LmNsZXJrLmFjY291bnRzLmRldiQ";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="en" className={inter.variable}>
        <body className="bg-black text-white antialiased">
  <div style={{ color: "red", fontSize: "30px" }}>
    TEST BUILD ACTIVE
  </div>
  {children}
</body>
      </html>
    </ClerkProvider>
  );
}