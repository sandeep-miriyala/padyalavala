// కథామాల: content/kathamala.json (పాత రత్నాలబాల నుంచే). Build సమయంలో చదువుతాం: సైట్ static.
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Katha = { id: string; age: string; title: string; lines: string[]; moral: string; text: string; size: number };

type File = { stories: { story_id: string; age_group: string; title: string; story_text: string[]; moral?: string }[] };

let cache: Katha[] | null = null;

export function getKathalu(): Katha[] {
  if (cache) return cache;
  const file = JSON.parse(readFileSync(join(process.cwd(), "content", "kathamala.json"), "utf8")) as File;
  cache = file.stories.map((s) => {
    const lines = s.story_text.map((l) => l.trim()).filter(Boolean);
    return { id: s.story_id, age: `${s.age_group} ఏళ్లు`, title: s.title.trim(), lines, moral: (s.moral ?? "").trim(), text: lines.join(" "), size: lines.length };
  });
  return cache;
}

/** వయసు గుంపులు, చిన్నవాళ్ల నుంచి. */
export function ageGroups(rows: Katha[]) {
  const seen = new Map<string, number>();
  for (const r of rows) seen.set(r.age, (seen.get(r.age) ?? 0) + 1);
  return [...seen.entries()].sort((a, b) => Number.parseInt(a[0], 10) - Number.parseInt(b[0], 10)).map(([age, count]) => ({ age, count }));
}
