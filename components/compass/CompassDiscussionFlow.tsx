import type { CompassDiscussionMessage } from "@/src/lib/compass/session";

import { CompassCard } from "./CompassCard";

const BODY_TEXT = "text-zinc-400";

function isPermissionMessage(content: string) {
  return (
    content.includes("Would you like me to reflect") ||
    content.includes("Would you like me to reflect what") ||
    content.includes("Would you like to pause here") ||
    content.includes("A pattern may be repeating here") ||
    content.includes("Would you like help working through this privately")
  );
}

function isStyleSelectionMessage(content: string) {
  return content.includes("How would you like Compass to work with you from here?");
}

export function CompassDiscussionFlow({
  discussionMessages,
  discussionInput,
  onDiscussionInputChange,
  onSend,
  onReady,
}: {
  discussionMessages: CompassDiscussionMessage[];
  discussionInput: string;
  onDiscussionInputChange: (value: string) => void;
  onSend: () => void;
  onReady: () => void;
}) {
  const latestMessage = discussionMessages[discussionMessages.length - 1];

  const showStyleChoices =
    latestMessage?.role === "compass" &&
    isStyleSelectionMessage(latestMessage.content);

  const showPermissionChoices =
    latestMessage?.role === "compass" &&
    isPermissionMessage(latestMessage.content) &&
    !showStyleChoices;

  return (
    <CompassCard
      title="Let’s sit with this before we move."
      description="This is where Compass helps reduce the pressure enough for movement to become possible again."
    >
      <div className="space-y-6">
        {discussionMessages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`text-sm leading-relaxed ${
              message.role === "compass"
                ? "rounded-[1.4rem] border border-[#2A2418] bg-[#12100D] p-5"
                : "rounded-[1.4rem] border border-zinc-800 bg-[#121212] p-5"
            }`}
          >
            <p
              className={`whitespace-pre-line ${
                message.role === "compass" ? BODY_TEXT : "text-zinc-100"
              }`}
            >
              {message.content}
            </p>

            {index === discussionMessages.length - 1 && showPermissionChoices && (
              <div className="mt-5 grid gap-3">
                <button
                  onClick={() => onDiscussionInputChange("Yes, reflect.")}
                  className="primary-button !mt-0"
                >
                  Yes, reflect
                </button>

                <button
                  onClick={() => onDiscussionInputChange("Not right now.")}
                  className="secondary-button !mt-0"
                >
                  Not right now
                </button>

                <button
                  onClick={() =>
                    onDiscussionInputChange("Ugh fine — tell me more.")
                  }
                  className="secondary-button !mt-0"
                >
                  Ugh fine — tell me more
                </button>
              </div>
            )}

            {index === discussionMessages.length - 1 && showStyleChoices && (
              <div className="mt-5 grid gap-3">
                <button
                  onClick={() => onDiscussionInputChange("Stay gentle.")}
                  className="secondary-button !mt-0"
                >
                  Stay gentle
                </button>

                <button
                  onClick={() => onDiscussionInputChange("Be direct.")}
                  className="primary-button !mt-0"
                >
                  Be direct
                </button>

                <button
                  onClick={() => onDiscussionInputChange("Mix both.")}
                  className="secondary-button !mt-0"
                >
                  Mix both
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <textarea
        value={discussionInput}
        onChange={(event) => onDiscussionInputChange(event.target.value)}
        placeholder="Let’s discuss openly. Often we struggle to take the next step because we may not yet trust ourselves to do what we said we would do.

If you feel resistance, uncertainty, pressure, avoidance, or emotional exhaustion around taking action, describe it honestly here.

Compass will work through it with you and help uncover the next best step."
        rows={6}
        className="compass-textarea"
      />

      <button onClick={onSend} className="primary-button">
        Send
      </button>

      <button onClick={onReady} className="secondary-button">
        I’m ready to choose the next step
      </button>
    </CompassCard>
  );
}

export function CompassExecutionCheck({
  executionFeeling,
  onExecutionFeelingChange,
  onFinalize,
}: {
  executionFeeling: string;
  onExecutionFeelingChange: (value: string) => void;
  onFinalize: () => void;
}) {
  return (
    <CompassCard
      title="Do you feel able to execute this?"
      description="If this still feels too large, unclear, public, emotionally loaded, or difficult to begin, Compass will reduce the pressure further."
    >
      <textarea
        value={executionFeeling}
        onChange={(event) => onExecutionFeelingChange(event.target.value)}
        placeholder="Does this feel realistic, emotionally safe, sustainable, too large, too public, unclear, or difficult to begin?"
        rows={6}
        className="compass-textarea"
      />

      <button onClick={onFinalize} className="primary-button">
        Finalize next step
      </button>
    </CompassCard>
  );
}

export function CompassComplete({
  finalStep,
  resonanceReflection,
  resonanceCtaHref,
  resonanceCtaLabel,
}: {
  finalStep: string;
  resonanceReflection: string | null;
  resonanceCtaHref: string | null;
  resonanceCtaLabel: string | null;
}) {
  return (
    <CompassCard
      title="Your next executable step"
      description="One real movement. Not the entire transformation."
    >
      <div
        className={`rounded-[1.5rem] border border-zinc-800 bg-[#121212] p-5 text-sm leading-relaxed whitespace-pre-line ${BODY_TEXT}`}
      >
        {finalStep}
      </div>

      {resonanceReflection && (
        <div className="rounded-[1.5rem] border border-zinc-800 bg-[#121212] p-5">
          <p className={`whitespace-pre-line text-sm leading-relaxed ${BODY_TEXT}`}>
            {resonanceReflection}
          </p>

          <a
            href={resonanceCtaHref ?? "https://www.oremea.com/?open=resonance"}
            className="primary-button inline-flex items-center justify-center"
          >
            {resonanceCtaLabel ?? "Explore Resonance"}
          </a>
        </div>
      )}
    </CompassCard>
  );
}