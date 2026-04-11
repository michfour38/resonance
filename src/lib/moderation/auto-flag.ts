export type AutoFlagCategory =
  | "violence"
  | "harassment"
  | "sexual"
  | "self_harm"
  | "spam";

export type AutoFlagMatch = {
  term: string;
  category: AutoFlagCategory;
  weight: number;
};

export type AutoFlagResult = {
  matched: boolean;
  score: number;
  categories: AutoFlagCategory[];
  matches: AutoFlagMatch[];
};

type Rule = {
  term: string;
  category: AutoFlagCategory;
  weight: number;
};

const RULES: Rule[] = [
  // violence
  { term: "kill", category: "violence", weight: 30 },
  { term: "murder", category: "violence", weight: 35 },
  { term: "stab", category: "violence", weight: 28 },
  { term: "shoot", category: "violence", weight: 28 },
  { term: "hurt you", category: "violence", weight: 24 },

  // harassment
  { term: "idiot", category: "harassment", weight: 12 },
  { term: "stupid", category: "harassment", weight: 12 },
  { term: "shut up", category: "harassment", weight: 14 },
  { term: "hate you", category: "harassment", weight: 16 },
  { term: "go die", category: "harassment", weight: 32 },

  // sexual
  { term: "nude", category: "sexual", weight: 20 },
  { term: "nudes", category: "sexual", weight: 22 },
  { term: "send pics", category: "sexual", weight: 18 },
  { term: "sex", category: "sexual", weight: 14 },

  // self harm
  { term: "kill myself", category: "self_harm", weight: 40 },
  { term: "want to die", category: "self_harm", weight: 40 },
  { term: "self harm", category: "self_harm", weight: 34 },
  { term: "end my life", category: "self_harm", weight: 42 },

  // spam
  { term: "buy now", category: "spam", weight: 10 },
  { term: "click here", category: "spam", weight: 10 },
  { term: "free money", category: "spam", weight: 12 },
  { term: "dm me now", category: "spam", weight: 8 },
  { term: "whatsapp me", category: "spam", weight: 8 },
];

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function detectAutoFlags(content: string): AutoFlagResult {
  const text = normalize(content);

  const matches: AutoFlagMatch[] = RULES.filter((rule) =>
    text.includes(rule.term)
  ).map((rule) => ({
    term: rule.term,
    category: rule.category,
    weight: rule.weight,
  }));

  const categories = Array.from(new Set(matches.map((m) => m.category)));

  const rawScore = matches.reduce((sum, match) => sum + match.weight, 0);
  const score = Math.min(rawScore, 100);

  return {
    matched: matches.length > 0,
    score,
    categories,
    matches,
  };
}