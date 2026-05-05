import type { GrammarPoint } from "./types";

import { GRAMMAR_POINT_LABELS } from "./types";

export const GRAMMAR_POINT_SUMMARIES: Record<GrammarPoint, string> = {
  "ageru": "あげる — to give an object outward (the speaker or in-group gives to someone else; never to me/us).",
  "kureru": "くれる — to give an object inward (someone else gives to me or my in-group).",
  "morau": "もらう — to receive an object (the receiver is the topic; the giver is marked with に or から).",
  "te-ageru": "てあげる — to do an action as a favor for someone else (the speaker or in-group does it for an out-group person).",
  "te-kureru": "てくれる — someone does an action as a favor for me or my in-group.",
  "te-morau": "てもらう — to have/get someone do an action for you (the favor-receiver is the topic).",
};

const F: Record<GrammarPoint, Partial<Record<GrammarPoint, string>>> = {
  ageru: {
    kureru: "You picked くれる, but くれる is used when someone gives **to me/us**. Here the speaker (or in-group) is the giver, not the receiver — so あげる is correct.",
    morau: "You picked もらう, but もらう means **to receive**. The subject of this sentence is the giver, not the receiver, so the outward-giving verb あげる is needed.",
    "te-ageru": "You picked てあげる, but this sentence is just about handing over an object — there's no preceding て-form verb describing an action being done as a favor. Use the plain あげる.",
    "te-kureru": "You picked てくれる, but this sentence has no て-form verb (no action being done for someone), and the speaker isn't on the receiving end. The plain あげる is correct.",
    "te-morau": "You picked てもらう, but this sentence is about giving a thing, not having someone perform an action. Use the plain あげる.",
  },
  kureru: {
    ageru: "You picked あげる, but あげる is used when the speaker (or in-group) is the **giver**. Here the speaker (or someone close to them) is the **receiver** of the gift, so くれる is the natural choice.",
    morau: "You picked もらう, but the subject of this sentence is the giver, not the receiver. もらう would require the receiver to be the subject. Since someone is giving **to me/us**, くれる fits.",
    "te-ageru": "You picked てあげる, but this sentence has no て-form action verb, and besides, てあげる describes an outward favor — here the favor flows toward the speaker. Use plain くれる.",
    "te-kureru": "You picked てくれる, but this sentence is about handing over an object, not performing an action. There's no て-form verb in front of the blank. The plain くれる is correct.",
    "te-morau": "You picked てもらう, but this sentence is about receiving an **object**, and the subject is the giver, not the receiver. くれる is the right verb.",
  },
  morau: {
    ageru: "You picked あげる, but the subject of this sentence is the **receiver**, not the giver. あげる would flip the direction. Use もらう, which puts the receiver as the topic.",
    kureru: "You picked くれる, but with くれる the subject is the **giver** and the receiver is me/us. Here the subject is the one receiving, so もらう is correct.",
    "te-ageru": "You picked てあげる, but this sentence is about getting an object, not performing an action for someone. Use plain もらう.",
    "te-kureru": "You picked てくれる, but there's no て-form action verb here, and the subject is the receiver of an object — もらう is what you want.",
    "te-morau": "You picked てもらう, but this sentence is about receiving an **object**, not having someone perform an action. The plain もらう is correct.",
  },
  "te-ageru": {
    ageru: "You picked あげる, but the blank is preceded by a て-form verb describing an **action being performed as a favor** for someone. That's the auxiliary てあげる, not the standalone あげる.",
    kureru: "You picked くれる, but the speaker (or in-group) is the one **doing** the favor, not receiving it. The favor flows outward, so てあげる is correct.",
    morau: "You picked もらう, but the subject is performing the action for someone else, not receiving anything. The outward-favor auxiliary てあげる fits here.",
    "te-kureru": "You picked てくれる, but the favor flows **away from** the speaker (or in-group), not toward them. The subject is the one helping, so it should be てあげる.",
    "te-morau": "You picked てもらう, but the subject is the one performing the action, not the one receiving the favor. Use てあげる instead.",
  },
  "te-kureru": {
    ageru: "You picked あげる, but the blank follows a て-form verb (someone is doing an **action** for the speaker), so we need an auxiliary, not standalone あげる. And the favor flows toward the speaker — てくれる.",
    kureru: "You picked くれる, but a て-form verb precedes the blank, meaning an **action** is being done as a favor — not just an object handed over. Use the auxiliary てくれる.",
    morau: "You picked もらう, but with もらう the subject is the receiver. Here the subject is the one **doing** the action for the speaker, so the favor flows inward via てくれる.",
    "te-ageru": "You picked てあげる, but the favor here is being done **for the speaker** (or in-group), not by them for someone else. Reverse the direction: てくれる.",
    "te-morau": "You picked てもらう, but the subject of this sentence is the **doer** of the favor, not the recipient. With the speaker as the beneficiary, てくれる is correct.",
  },
  "te-morau": {
    ageru: "You picked あげる, but a て-form verb precedes the blank, so we need an auxiliary. And the subject is the one **receiving** the favor of an action — that's てもらう.",
    kureru: "You picked くれる, but with くれる the subject is the doer of the favor. Here the subject is the one who **had** someone do something for them, so てもらう fits.",
    morau: "You picked もらう, but the blank is preceded by a て-form verb describing an **action being performed**, not an object being handed over. Use the auxiliary てもらう.",
    "te-ageru": "You picked てあげる, but the subject is the one receiving the favor, not performing it. Flip the direction: てもらう.",
    "te-kureru": "You picked てくれる, but with てくれる the subject is the **doer** of the favor. Here the subject is the one who arranged for someone else to do it — that's てもらう.",
  },
};

export function getWrongAnswerFeedback(selected: GrammarPoint, correct: GrammarPoint): string {
  if (selected === correct) {
    return "";
  }
  const tailored = F[correct][selected];
  if (tailored) {
    return tailored;
  }
  return `${GRAMMAR_POINT_LABELS[selected]} isn't right here. The correct answer is ${GRAMMAR_POINT_LABELS[correct]}: ${GRAMMAR_POINT_SUMMARIES[correct]}`;
}
