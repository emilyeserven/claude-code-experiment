export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export type ResourceName = "jlptsensei";

export type ResourceType = "book" | "website" | "interactive";

export interface Resource {
  name: ResourceName;
  location: string;
  type: ResourceType;
}

export interface GrammarPoint {
  level: JlptLevel;
  number: number;
  japanese: string;
  romaji: string;
  english: string;
  resources: Resource[];
}
