export type GrammarPoint
  = | "ageru"
    | "kureru"
    | "morau"
    | "te-ageru"
    | "te-kureru"
    | "te-morau";

export const GRAMMAR_POINTS: readonly GrammarPoint[] = [
  "ageru",
  "kureru",
  "morau",
  "te-ageru",
  "te-kureru",
  "te-morau",
] as const;

export const GRAMMAR_POINT_LABELS: Record<GrammarPoint, string> = {
  "ageru": "あげる",
  "kureru": "くれる",
  "morau": "もらう",
  "te-ageru": "てあげる",
  "te-kureru": "てくれる",
  "te-morau": "てもらう",
};

export interface Sentence {

  id: string;

  grammarPoint: GrammarPoint;

  japanese: string;

  japaneseBlank: string;

  acceptableAnswers: readonly string[];

  english: string;

  note?: string;
}

export type Mode = "mixed" | "fill-in-blank" | "reveal-translation" | "grammar-point-grid";

export const MODES: { mode: Mode;
  label: string;
  testId: string; }[] = [
  {
    mode: "mixed",
    label: "Mixed",
    testId: "mode-mixed",
  },
  {
    mode: "fill-in-blank",
    label: "Fill in the blank",
    testId: "mode-fill-in-blank",
  },
  {
    mode: "reveal-translation",
    label: "Reveal translation",
    testId: "mode-reveal-translation",
  },
  {
    mode: "grammar-point-grid",
    label: "Pick the grammar point",
    testId: "mode-grammar-point-grid",
  },
];
