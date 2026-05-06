import { describe, expect, it } from "vitest";

import { romajiToHiragana, romajiToHiraganaInProgress } from "./romajiToHiragana";

describe("romajiToHiragana", () => {
  it("converts basic vowels", () => {
    expect(romajiToHiragana("aiueo")).toBe("あいうえお");
  });

  it("converts ageru and conjugations", () => {
    expect(romajiToHiragana("ageru")).toBe("あげる");
    expect(romajiToHiragana("ageta")).toBe("あげた");
    expect(romajiToHiragana("agemashita")).toBe("あげました");
    expect(romajiToHiragana("agemasu")).toBe("あげます");
    expect(romajiToHiragana("agenai")).toBe("あげない");
    expect(romajiToHiragana("agenakatta")).toBe("あげなかった");
    expect(romajiToHiragana("agete")).toBe("あげて");
  });

  it("converts kureru and conjugations", () => {
    expect(romajiToHiragana("kureru")).toBe("くれる");
    expect(romajiToHiragana("kureta")).toBe("くれた");
    expect(romajiToHiragana("kuremashita")).toBe("くれました");
    expect(romajiToHiragana("kuremasen")).toBe("くれません");
  });

  it("converts morau and conjugations with sokuon", () => {
    expect(romajiToHiragana("morau")).toBe("もらう");
    expect(romajiToHiragana("moratta")).toBe("もらった");
    expect(romajiToHiragana("moraimashita")).toBe("もらいました");
    expect(romajiToHiragana("moraimasu")).toBe("もらいます");
  });

  it("converts auxiliary forms with hyphen tolerated", () => {
    expect(romajiToHiragana("teageta")).toBe("てあげた");
    expect(romajiToHiragana("te-ageta")).toBe("てあげた");
    expect(romajiToHiragana("tekureta")).toBe("てくれた");
    expect(romajiToHiragana("temoratta")).toBe("てもらった");
  });

  it("handles small tsu (sokuon) for doubled consonants", () => {
    expect(romajiToHiragana("katta")).toBe("かった");
    expect(romajiToHiragana("kitte")).toBe("きって");
  });

  it("handles n followed by consonant or end-of-string", () => {
    expect(romajiToHiragana("hon")).toBe("ほん");
    expect(romajiToHiragana("kanji")).toBe("かんじ");
    expect(romajiToHiragana("kuremasen")).toBe("くれません");
  });

  it("handles youon (combined kana)", () => {
    expect(romajiToHiragana("kyou")).toBe("きょう");
    expect(romajiToHiragana("shashin")).toBe("しゃしん");
    expect(romajiToHiragana("agemashou")).toBe("あげましょう");
  });

  it("is case-insensitive", () => {
    expect(romajiToHiragana("AGERU")).toBe("あげる");
    expect(romajiToHiragana("Ageta")).toBe("あげた");
  });

  it("returns empty string for empty input", () => {
    expect(romajiToHiragana("")).toBe("");
  });

  it("preserves unknown characters", () => {
    expect(romajiToHiragana("a?")).toBe("あ?");
  });
});

describe("romajiToHiraganaInProgress", () => {
  it("preserves trailing single n so 'no' can still become の", () => {
    expect(romajiToHiraganaInProgress("n")).toBe("n");
    expect(romajiToHiraganaInProgress("ho")).toBe("ほ");
    expect(romajiToHiraganaInProgress("hon")).toBe("ほn");
  });

  it("converts trailing nn to ん", () => {
    expect(romajiToHiraganaInProgress("konn")).toBe("こん");
  });

  it("passes pure hiragana through unchanged", () => {
    expect(romajiToHiraganaInProgress("あげた")).toBe("あげた");
  });

  it("converts mixed input on each keystroke", () => {
    expect(romajiToHiraganaInProgress("a")).toBe("あ");
    expect(romajiToHiraganaInProgress("あg")).toBe("あg");
    expect(romajiToHiraganaInProgress("あge")).toBe("あげ");
    expect(romajiToHiraganaInProgress("あげt")).toBe("あげt");
    expect(romajiToHiraganaInProgress("あげta")).toBe("あげた");
  });
});
