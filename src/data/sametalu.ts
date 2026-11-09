// సామెతలమాల: content/sametalu/*.json (ఒక్కో అక్షరానికి ఒక ఫైల్). Build సమయంలోనే చదువుతాం,
// కాబట్టి సైట్ static గానే ఉంటుంది: సర్వర్ అక్కర్లేదు, ఆఫ్‌లైన్‌లోనూ పనిచేస్తుంది.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type Sametha = { id: string; letter: string; text: string; words: number };

type File = { letter: string; sametalu: { id: string; text: string }[] };

let cache: Sametha[] | null = null;

export function getSametalu(): Sametha[] {
  if (cache) return cache;
  const dir = join(process.cwd(), "content", "sametalu");
  const rows: Sametha[] = [];
  for (const f of readdirSync(dir).filter((n) => n.endsWith(".json")).sort()) {
    const file = JSON.parse(readFileSync(join(dir, f), "utf8")) as File;
    for (const s of file.sametalu) {
      const text = s.text.trim();
      // a few files start with the letter itself as a heading: not a proverb
      if (text.length < 4) continue;
      rows.push({ id: s.id, letter: file.letter, text, words: text.split(/\s+/).filter(Boolean).length });
    }
  }
  const order = new Intl.Collator("te");
  rows.sort((a, b) => order.compare(a.text, b.text));
  cache = rows;
  return rows;
}

/** Letters in Telugu order, with how many proverbs each has. */
export function sametaluLetters(rows: Sametha[]) {
  const counts = new Map<string, number>();
  for (const r of rows) counts.set(r.letter, (counts.get(r.letter) ?? 0) + 1);
  const order = new Intl.Collator("te");
  return [...counts.entries()].sort((a, b) => order.compare(a[0], b[0])).map(([letter, count]) => ({ letter, count }));
}
