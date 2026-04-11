import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Static full-screen background */}
      <img
        src="/images/oremea-bg-desktop.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Fixed shell */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-4 md:px-6 md:py-6">
        <div className="flex w-full max-w-[520px] flex-col items-center">
          {/* Logo */}
          <div className="mb-3 flex justify-center">
            <img
              src="/images/oremea-logo-wht.png"
              alt="Oremea"
              className="h-16 w-auto md:h-20"
            />
          </div>

          {/* Heading */}
          <div className="mb-4 text-center">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Enter Resonance
            </h1>

            <p className="mx-auto mt-3 max-w-[540px] text-sm leading-7 text-white/85 md:text-base">
              A guided experience for self-reflection, relational growth, and
              the kind of clarity that comes through lived experience.
            </p>
          </div>

          {/* Auth shell */}
          <div className="w-full rounded-[1.75rem] border border-white/10 bg-[rgba(35,15,5,0.78)] p-4 backdrop-blur-sm">
            <div className="rounded-[1.25rem] bg-white p-5 text-black">
              <div className="max-h-[70vh] overflow-y-auto pr-1">
                <SignIn
                  path="/sign-in"
                  routing="path"
                  signUpUrl="/sign-up"
                  forceRedirectUrl="/resonance/intro"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      cardBox: "shadow-none w-full",
                      card: "shadow-none border-0 bg-transparent p-0 min-h-0",
                      header: "hidden",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      formHeaderTitle: "hidden",
                      formHeaderSubtitle: "hidden",
                      socialButtonsBlockButton:
                        "h-11 rounded-xl border border-black/10 shadow-none",
                      socialButtonsBlockButtonText: "text-sm font-medium",
                      dividerLine: "bg-black/10",
                      dividerText: "text-black/45",
                      formFieldLabel: "text-sm font-medium text-black",
                      formFieldInput:
                        "h-11 rounded-xl border border-black/10 shadow-none",
                      formButtonPrimary:
                        "h-11 rounded-xl bg-black text-white hover:bg-neutral-900 shadow-none",
                      footerAction: "pt-2",
                      footerActionText: "text-black/60",
                      footerActionLink:
                        "text-black underline underline-offset-4 hover:text-black/70",
                      formResendCodeLink:
                        "text-black underline underline-offset-4 hover:text-black/70",
                      otpCodeFieldInput:
                        "h-11 w-11 rounded-xl border border-black/10",
                      alert: "rounded-xl",
                      alertText: "text-sm",
                      identityPreviewText: "text-black",
                    },
                    layout: {
                      socialButtonsPlacement: "top",
                      showOptionalFields: false,
                      logoPlacement: "none",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}