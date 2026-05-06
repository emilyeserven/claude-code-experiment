---
name: add-giving-receiving-sentence
description: Add a sentence (or batch of sentences) to the Giving and Receiving quiz pool in `sentences.ts`. Use when the user asks to add example sentences for あげる / くれる / もらう / てあげる / てくれる / てもらう practice.
---

# Add a Giving and Receiving sentence

Each sentence in `packages/client/src/routes/quizzes/giving-and-receiving/-utils/sentences.ts` powers all three question types (fill-in-the-blank, reveal-translation, grammar-point grid). Get the data right once and it works everywhere.

## Required fields

```ts
{
  id: "ageru-018",                       // see "ID convention" below
  grammarPoint: "ageru",                  // one of the six GrammarPoint values
  japanese: "私は友達にプレゼントをあげた。",  // full sentence with the verb
  japaneseBlank: "私は友達にプレゼントを___。", // same sentence with the auxiliary blanked
  acceptableAnswers: A_PAST,              // hiragana strings that count as correct
  english: "I gave my friend a present.", // natural English translation
}
```

## ID convention

`<grammar-point>-<3-digit-sequence>` — e.g. `ageru-018`, `te-morau-017`. Find the next free number for the grammar point you're adding to and continue from there. IDs must be unique across the whole pool.

## Picking the grammar point

| Use | When |
|-----|------|
| `ageru` | The subject/in-group **gives an object** to someone else (never to me/us). |
| `kureru` | Someone outside gives an object **to me or my in-group**. |
| `morau` | The subject is the **receiver** of an object; the giver is marked with に or から. |
| `te-ageru` | The subject **does an action as a favor** for someone else (paired with a て-form verb). |
| `te-kureru` | Someone outside **does an action as a favor for me or my in-group**. |
| `te-morau` | The subject **has someone do** an action for them (favor-receiver-as-topic). |

If the receiver is the speaker's family member (mother, sister, my dog, my child), treat them as **in-group** — use `kureru` / `te-kureru` / `morau` / `te-morau` accordingly, never `ageru` / `te-ageru` for "they gave to my family".

## Building `japaneseBlank`

Replace **only the auxiliary giving/receiving verb** with `___`. Keep any preceding て-form attached to its main verb.

| Pattern | japanese | japaneseBlank |
|---------|----------|---------------|
| あげる / くれる / もらう (standalone) | `私は友達にプレゼントをあげた。` | `私は友達にプレゼントを___。` |
| てあげる / てくれる / てもらう (auxiliary) | `私は友達に道を教えてあげた。` | `私は友達に道を教えて___。` |

The blank for `てあげた` is just `あげた` (the て stays with `教え`). The user reads the て directly before the blank, which signals that this is the auxiliary form. The grammar-point grid is what tests the standalone-vs-auxiliary distinction.

## Picking `acceptableAnswers`

Use the existing constants at the top of `-utils/sentences.ts`:

| Constant | Hiragana set | Use for |
|----------|--------------|---------|
| `A_PAST` | `["あげた", "あげました"]` | past-tense あげる/てあげる |
| `A_PRES` | `["あげる", "あげます"]` | non-past あげる/てあげる |
| `K_PAST` | `["くれた", "くれました"]` | past-tense くれる/てくれる |
| `M_PAST` | `["もらった", "もらいました"]` | past-tense もらう/てもらう |

If you need a form that isn't in the table (e.g. negative past `あげなかった` / `あげませんでした`, te-form `あげて`, volitional, etc.), inline an array literal — don't add a new shared constant unless three or more sentences will share it.

## Translation rules

- Use a **natural English** translation, not a literal one. "私は友達に道を教えてあげた。" → "I showed my friend the way" is better than "I told my friend the road as a favor."
- For てもらう/てくれる, English usually drops the favor nuance ("My friend showed me the way" rather than "My friend kindly showed me the way"). That's fine — the question types don't quiz on the favor wording.
- **Never let the English give away which grammar point is correct** beyond what the meaning naturally implies. Don't write "(received)" or "(as a favor)" — the user has to deduce it from who's doing what to whom.

## Validation checklist before committing

1. Did you add the entry to the `SENTENCES` array (not a new array)?
2. Is the `id` unique?
3. Is the `grammarPoint` correct given the directionality?
4. Does `japaneseBlank` differ from `japanese` only by the auxiliary verb being replaced with `___`?
5. Does the first entry of `acceptableAnswers` match the form actually used in `japanese` (in hiragana)?
6. Is the English translation natural and free of grammar-point spoilers?
7. Run `pnpm lint:fix && pnpm lint && pnpm test` from the repo root.

## Bulk additions

When the user pastes a batch of sentences, append them in order to the matching grammar-point block (keep IDs grouped: all `ageru-*` together, then all `kureru-*`, etc.) and bump the IDs sequentially. Do not reorder or deduplicate existing entries.
