export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export interface GrammarPoint {
  id: string;
  level: JlptLevel;
  number: number;
  japanese: string;
  romaji: string;
  english: string;
}

export const JLPT_LEVELS: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export type ResourceType = "textbook" | "website" | "drillbook";

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  location: string;
  bookmarks: string[];
}

export interface GrammarBookmark {
  id: string;
  location: string;
  resource: string;
  jlpt: string;
}

export interface BookmarkDisplay {
  resourceName: string;
  location: string;
}

export interface GrammarRow extends GrammarPoint {
  bookmarks: BookmarkDisplay[];
}
