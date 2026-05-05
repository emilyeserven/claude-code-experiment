# Giving and Receiving Quiz

This feature drills the Japanese giving/receiving verbs:

| Standalone | Auxiliary (て-form) | Direction |
|------------|---------------------|-----------|
| あげる | てあげる | Speaker / in-group → out-group |
| くれる | てくれる | Out-group → speaker / in-group |
| もらう | てもらう | Receiver-as-topic |

## Files

- `types.ts` — `GrammarPoint` union, `Sentence` interface, label/order constants.
- `sentences.ts` — pool of **100** sentences. Order matters only for `id` collisions; rounds pick randomly.
- `feedback.ts` — `getWrongAnswerFeedback(selected, correct)` returns a tailored explanation for each (correct, selected) pair plus per-grammar-point summaries.
- `FillInBlank.tsx` — type-the-missing-verb mode. Romaji is auto-converted to hiragana via `@/utils/romajiToHiragana` while typing.
- `RevealTranslation.tsx` — show the Japanese, click to reveal the English, then self-rate (Again / Hard / Good / Easy).
- `GrammarPointGrid.tsx` — show the English, pick the grammar point from a 2×3 grid (placement randomized per round).
- `GivingReceivingQuiz.tsx` — container. Picks a random sentence + question type each round. "Mixed" mode rotates randomly across the three question types.

## Routing

- `/quizzes` (in `routes/quizzes.tsx`) lists available quizzes.
- `/quizzes/giving-and-receiving` (in `routes/quizzes.giving-and-receiving.tsx`) renders `GivingReceivingQuiz`.

When you add or rename route files, regenerate the route tree:

```bash
pnpm --filter=@cc-experiments/client run routeTree
```

## Question type rules (do not change without updating tests + UX copy)

1. **Fill-in-the-blank**: the English translation is shown for context. The blank covers only the auxiliary giving/receiving verb (the て stays attached to the main verb in て-form sentences). User input is romaji that gets converted to hiragana live.
2. **Reveal-translation**: the Japanese is shown and the user clicks to reveal the English. The user self-rates how well they understood — there is no automated grading. Used as flash-card style review.
3. **Pick the grammar point**: only the English translation is shown. The user picks one of the six grammar points from a 2×3 grid; placement is shuffled per round via a deterministic seed.

**Never quiz the user on the English translation of a sentence.** The English is always provided when shown — it is context, not a prompt.

## Failure feedback

- Type 1 (Fill-in-the-blank): if the typed answer's leading hiragana matches a different grammar point, surface the tailored `(selected → correct)` explanation. Otherwise show the generic `correct` summary.
- Type 3 (Pick the grammar point): always show the tailored explanation for `(selected → correct)`. Never reuse a generic message when a tailored one exists.

## Adding new sentences

See `SKILL.md` in this directory.
