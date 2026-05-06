export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export interface GrammarPoint {
  level: JlptLevel;
  number: number;
  japanese: string;
  english: string;
}
