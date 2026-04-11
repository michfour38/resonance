export type HoldingContent = {
  title: string;
  description: string;
  prompts: string[];
  waveNameOptions: string[];
  arrivalNotes: {
    title: string;
    body: string;
  }[];
};

export async function getHoldingContent(): Promise<HoldingContent> {
  return {
    title: "Your Wave begins soon",
    description:
      "You are in the pre-wave holding space. For now, complete light onboarding and profile-shaping prompts. Active Wave prompts unlock when your Wave starts.",
    prompts: [
      "What are you hoping to understand more deeply about yourself in relationships?",
      "What kind of connection feels most nourishing to you right now?",
      "What do you hope others come to understand about you over time?",
      "What usually helps you feel safe enough to be more honest?",
      "What kind of presence do you naturally bring into a group?",
    ],
    waveNameOptions: [
      "Quiet Wave of Courage",
      "Wave of Becoming",
      "Wave of Gentle Truth",
      "Wave of Open Hearts",
      "Wave of Sacred Reflection",
      "Wave of Brave Tenderness",
    ],
    arrivalNotes: [
      {
        title: "You do not need to arrive fully formed",
        body:
          "Many members enter quietly. They do not always have clear answers yet — only a sense that they are ready for something more honest.",
      },
      {
        title: "Depth usually begins slowly",
        body:
          "The first days are not about performing openness. They are about noticing what feels true, what feels defended, and what begins to soften over time.",
      },
      {
        title: "Different members are drawn by different longings",
        body:
          "Some come for clarity. Some for meaningful connection. Some for healing, recognition, or a more conscious way of relating.",
      },
    ],
  };
}