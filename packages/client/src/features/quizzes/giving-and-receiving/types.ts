export type GrammarPoint =
  | "ageru"
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
