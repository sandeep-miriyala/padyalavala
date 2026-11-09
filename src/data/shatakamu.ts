// శతకమాల: content/shatakamu/<సంపుటి>/*.md (ఒక్కో పద్యానికి ఒక ఫైల్, పాత రత్నాలబాల నుంచే).
// Build సమయంలోనే చదువుతాం: సైట్ static, సర్వర్ అక్కర్లేదు, ఆఫ్‌లైన్‌లోనూ పనిచేస్తుంది.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type Book = { id: string; title: string; author: string; aliases: string[] };

export const BOOKS: Book[] = [
  { id: "Jandhyala", title: "తెలుగుబాల", author: "శ్రీ జంధ్యాల పాపయ్య శాస్త్రి గారు", aliases: ["తెలుగుబాల", "జంధ్యాల"] },
  { id: "Sumati", title: "సుమతీ శతకం", author: "శ్రీ బద్దెన గారు", aliases: ["సుమతీ", "సుమతి", "బద్దెన"] },
  { id: "SriKalahastheeswara", title: "శ్రీకాళహస్తీశ్వర శతకం", author: "శ్రీ ధూర్జటి గారు", aliases: ["శ్రీకాళహస్తీశ్వర", "కాళహస్తీశ్వర", "ధూర్జటి"] },
  { id: "KrishnaSatakam", title: "కృష్ణ శతకం", author: "శ్రీ నరసింహ కవి గారు", aliases: ["కృష్ణ"] },
  { id: "NarayanaSatakam", title: "నారాయణ శతకం", author: "శ్రీ బమ్మెర పోతన గారు", aliases: ["నారాయణ", "పోతన"] },
  { id: "Annamacharya", title: "శ్రీ వేంకటేశ్వర శతకం", author: "శ్రీ తాళ్లపాక అన్నమాచార్యుఁడు గారు", aliases: ["వేంకటేశ్వర", "అన్నమాచార్య", "అన్నమయ్య"] },
  { id: "ShivanandaLahari", title: "శివానందలహరి", author: "శ్రీ ఆది శంకరాచార్యులు గారు", aliases: ["శివానందలహరి", "శివానంద", "శంకరాచార్య"] },
  { id: "RamachandraPrabhu", title: "రామచంద్ర ప్రభు శతకం", author: "శ్రీ కూచి నరసింహము గారు", aliases: ["రామచంద్ర", "రామచంద్రప్రభు"] },
  { id: "YajnavalkyaSatakam", title: "శ్రీ యాజ్ఞవల్క్య శతకం", author: "శ్రీ చింతా రామకృష్ణారావు గారు", aliases: ["యాజ్ఞవల్క్య"] },
  { id: "DasarathiKaruNapaYonidhi", title: "దాశరథీ శతకం", author: "శ్రీ భద్రాచల రామదాసు గారు", aliases: ["దాశరథీ", "దాశరథి", "రామదాసు"] },
  { id: "TeaShatakam", title: "టీ శతకం", author: "శ్రీ ప్రసాదరావు మిరియాల గారు", aliases: ["టీ", "కాఫీ"] },
];

export type Padyam = {
  id: string; // Sumati-12
  book: string; // Sumati
  bookTitle: string;
  num: number;
  text: string; // పద్యం, పాదాలు \n తో
  meaning: string; // భావం (కొన్ని సంపుటాల్లో మాత్రమే)
  first: string; // మొదటి పాదం: గ్రిడ్‌లో చూపడానికి
  lines: number;
};

function parse(raw: string, book: Book, num: number): Padyam {
  const body = raw.replace(/^﻿/, "").replace(/^---[\s\S]*?\n---\s*/, "");
  const [poemPart, ...rest] = body.split(/\n\s*భావం\s*[:：]\s*/);
  const lines = poemPart
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !/^\d+$/.test(l)); // దాశరథీ ఫైళ్లలో మొదట వరుస సంఖ్య మాత్రమే ఉంటుంది
  const meaning = rest.join(" ").replace(/\s+/g, " ").trim();
  return {
    id: `${book.id}-${num}`,
    book: book.id,
    bookTitle: book.title,
    num,
    text: lines.join("\n"),
    meaning,
    first: lines[0] ?? "",
    lines: lines.length,
  };
}

const cache = new Map<string, Padyam[]>();

export function getPadyalu(bookId: string): Padyam[] {
  const hit = cache.get(bookId);
  if (hit) return hit;
  const book = BOOKS.find((b) => b.id === bookId);
  const dir = join(process.cwd(), "content", "shatakamu", bookId);
  if (!book || !existsSync(dir)) return [];
  const list = readdirSync(dir)
    .filter((f) => /^\d+\.md$/.test(f))
    .map((f) => parse(readFileSync(join(dir, f), "utf8"), book, Number.parseInt(f, 10)))
    .filter((p) => p.text)
    .sort((a, b) => a.num - b.num);
  cache.set(bookId, list);
  return list;
}

export function getAllPadyalu(): Padyam[] {
  return BOOKS.flatMap((b) => getPadyalu(b.id));
}
