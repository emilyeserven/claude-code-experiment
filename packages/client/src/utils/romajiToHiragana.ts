const KANA_MAP: Record<string, string> = {
  a: "あ",
  i: "い",
  u: "う",
  e: "え",
  o: "お",
  ka: "か",
  ki: "き",
  ku: "く",
  ke: "け",
  ko: "こ",
  ga: "が",
  gi: "ぎ",
  gu: "ぐ",
  ge: "げ",
  go: "ご",
  sa: "さ",
  shi: "し",
  si: "し",
  su: "す",
  se: "せ",
  so: "そ",
  za: "ざ",
  ji: "じ",
  zi: "じ",
  zu: "ず",
  ze: "ぜ",
  zo: "ぞ",
  ta: "た",
  chi: "ち",
  ti: "ち",
  tsu: "つ",
  tu: "つ",
  te: "て",
  to: "と",
  da: "だ",
  di: "ぢ",
  du: "づ",
  de: "で",
  do: "ど",
  na: "な",
  ni: "に",
  nu: "ぬ",
  ne: "ね",
  no: "の",
  ha: "は",
  hi: "ひ",
  fu: "ふ",
  hu: "ふ",
  he: "へ",
  ho: "ほ",
  ba: "ば",
  bi: "び",
  bu: "ぶ",
  be: "べ",
  bo: "ぼ",
  pa: "ぱ",
  pi: "ぴ",
  pu: "ぷ",
  pe: "ぺ",
  po: "ぽ",
  ma: "ま",
  mi: "み",
  mu: "む",
  me: "め",
  mo: "も",
  ya: "や",
  yu: "ゆ",
  yo: "よ",
  ra: "ら",
  ri: "り",
  ru: "る",
  re: "れ",
  ro: "ろ",
  wa: "わ",
  wo: "を",
  nn: "ん",

  kya: "きゃ",
  kyu: "きゅ",
  kyo: "きょ",
  gya: "ぎゃ",
  gyu: "ぎゅ",
  gyo: "ぎょ",
  sha: "しゃ",
  shu: "しゅ",
  sho: "しょ",
  sya: "しゃ",
  syu: "しゅ",
  syo: "しょ",
  ja: "じゃ",
  ju: "じゅ",
  jo: "じょ",
  jya: "じゃ",
  jyu: "じゅ",
  jyo: "じょ",
  cha: "ちゃ",
  chu: "ちゅ",
  cho: "ちょ",
  tya: "ちゃ",
  tyu: "ちゅ",
  tyo: "ちょ",
  nya: "にゃ",
  nyu: "にゅ",
  nyo: "にょ",
  hya: "ひゃ",
  hyu: "ひゅ",
  hyo: "ひょ",
  bya: "びゃ",
  byu: "びゅ",
  byo: "びょ",
  pya: "ぴゃ",
  pyu: "ぴゅ",
  pyo: "ぴょ",
  mya: "みゃ",
  myu: "みゅ",
  myo: "みょ",
  rya: "りゃ",
  ryu: "りゅ",
  ryo: "りょ",
};

const VOWELS = new Set(["a", "i", "u", "e", "o"]);

// Like romajiToHiragana, but preserves a trailing single "n" so a user mid-typing
// "no" doesn't see ん committed before the "o" arrives. Trailing "nn" still
// converts to ん since it's unambiguous.
export function romajiToHiraganaInProgress(input: string): string {
  const lower = input.toLowerCase();
  if (lower.endsWith("n") && !lower.endsWith("nn")) {
    return romajiToHiragana(input.slice(0, -1)) + input.slice(-1);
  }
  return romajiToHiragana(input);
}

export function romajiToHiragana(input: string): string {
  const normalized = input.toLowerCase().replace(/-/g, "");
  let result = "";
  let i = 0;

  while (i < normalized.length) {
    let matched = false;
    for (const len of [3, 2, 1]) {
      const sub = normalized.slice(i, i + len);
      if (sub.length === len && KANA_MAP[sub]) {
        result += KANA_MAP[sub];
        i += len;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    const c = normalized[i];

    if (c && !VOWELS.has(c) && c !== "n") {
      const next = normalized[i + 1];
      if (next === c) {
        result += "っ";
        i += 1;
        continue;
      }
    }

    if (c === "n") {
      const next = normalized[i + 1];
      if (!next || (!VOWELS.has(next) && next !== "y")) {
        result += "ん";
        i += 1;
        continue;
      }
    }

    result += c ?? "";
    i += 1;
  }

  return result;
}
