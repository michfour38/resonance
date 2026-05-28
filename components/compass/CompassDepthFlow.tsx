import {
  buildAdaptiveRecursiveQuestion,
  type CompassAreaResponse,
  type CompassGoalArea,
  type CompassRecursiveLayer,
} from "@/src/lib/compass/session";

import { CompassCard } from "./CompassCard";

const BODY_TEXT = "text-zinc-400";

const AREA_LABELS: Record<CompassGoalArea, string> = {
  relationships: "Relationships",
  income: "Income",
  health: "Health",
  spirituality: "Spirituality",
  investments: "Investments",
  network: "Network",
  knowledge: "Knowledge",
  lifestyle: "Lifestyle",
};

export function CompassDepthIntro({
  selectedAreaLabel,
  onBegin,
}: {
  selectedAreaLabel: string;
  onBegin: () => void;
}) {
  return (
    <CompassCard
      title="Great, now we're getting into it."
      description={`Let's go deeper into your priority of ${selectedAreaLabel}.`}
    >
      <p className={`text-sm leading-relaxed ${BODY_TEXT}`}>
        You may notice we ask a few similar questions. The repetition is
        deliberate.
      </p>

      <p className={`text-sm leading-relaxed ${BODY_TEXT}`}>
        Compass is not only looking at the goal itself.

The Descent follows the deeper thread beneath it:
the pressure,
the values,
the contradictions,
the resistance,
the emotional weight,
and the reason this still matters to you.
      </p>

      <button onClick={onBegin} className="primary-button">
  Begin The Descent
</button>
    </CompassCard>
  );
}

export function CompassDepthFlow({
  selectedArea,
  selectedAreaLabel,
  areaResponses,
  recursiveLayers,
  recursiveAnswer,
  onAnswerChange,
  onSubmitAnswer,
}: {
  selectedArea: CompassGoalArea | null;
  selectedAreaLabel: string;
  areaResponses: CompassAreaResponse[];
  recursiveLayers: CompassRecursiveLayer[];
  recursiveAnswer: string;
  onAnswerChange: (value: string) => void;
  onSubmitAnswer: () => void;
}) {
  return (
    <CompassCard
      eyebrow={`The Descent · Layer ${recursiveLayers.length + 1} of 7`}
      title={buildAdaptiveRecursiveQuestion({
        layer: recursiveLayers.length + 1,
        selectedAreaLabel,
        previousAnswer:
          recursiveLayers[recursiveLayers.length - 1]?.answer ?? "",
        firstAnswer:
          areaResponses.find((response) => response.area === selectedArea)
            ?.answer ?? "",
      })}
      description={
  recursiveLayers.length > 0
    ? "The thread beneath this is beginning to narrow."
    : `The Descent will follow the deeper thread beneath your focus on ${selectedAreaLabel.toLowerCase()}.`
}
    >
      <textarea
        value={recursiveAnswer}
        onChange={(event) => onAnswerChange(event.target.value)}
        placeholder="Answer openly. The more context you give, the more Compass can help reflect possible patterns, values, and next steps."
        rows={7}
        className="compass-textarea"
      />

      <button onClick={onSubmitAnswer} className="primary-button">
        Continue
      </button>
    </CompassCard>
  );
}