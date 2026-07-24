export type RecognitionQuestion = {
  key: string;
  text: string;
  support?: string;
};

export const RECOGNITION_QUESTIONS: RecognitionQuestion[] = [
  {
    key: "attention",
    text: "What has been taking up the most space in your attention lately?",
    support:
      "Start wherever your mind keeps returning. Give it enough detail that someone reading your words could understand what has your attention.",
  },
  {
    key: "reality",
    text: "Stay with what you just named. What is actually happening around it right now?",
    support:
      "You can include what happened, who is involved, what has changed, and what keeps requiring your attention.",
  },
  {
    key: "people",
    text: "Who is involved in what you have described, and what is each person actually doing or carrying?",
    support:
      "Stay close to what you can observe: actions, responsibilities, contributions, choices, conversations, and current circumstances.",
  },
  {
    key: "returning",
    text: "Looking back at what you have written so far, what appears more than once or keeps returning in different words?",
    support:
      "Read your earlier answers before responding. Notice repeated experiences, concerns, responsibilities, needs, or phrases.",
  },
  {
    key: "participation",
    text: "Where do you see yourself appearing repeatedly inside what you have described?",
    support:
      "Notice what you keep doing, carrying, choosing, providing, protecting, or attending to.",
  },
  {
    key: "weight",
    text: "Which part of everything you have written carries the most weight for you?",
    support:
      "Stay with that part for a moment. What gives it its importance?",
  },
  {
    key: "distinction",
    text: "When you place your answers beside one another, what becomes easier to distinguish?",
    support:
      "Something may separate into clearer parts: what belongs to you, what belongs to someone else, what matters, what is required, what is available, or what has changed.",
  },
  {
    key: "clarity",
    text: "What do you already know clearly now?",
    support:
      "Use your own words. Let the clarity be as simple, specific, or unfinished as it genuinely is.",
  },
  {
    key: "clarity_holding",
    text: "Where does that clarity become harder to hold?",
    support:
      "Look at what happens when other people, expectations, emotions, responsibilities, or consequences enter the picture.",
  },
  {
    key: "recognition",
    text: "Read everything you have written from the beginning. What can you see now that was less visible when you started?",
    support:
      "Let your own explanations show you. Notice what becomes stark when the answers are placed together.",
  },
];