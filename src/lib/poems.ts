// Poems from content/<book>/*.md, read once at build time (static export: no server, no database).
// Each file: "title:" (and optional "order:" for the book order) between --- lines, then the poem.
// Add a poem by adding a .md file.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export type BookId = "ratnalabala" | "mira";

export type Book = { id: BookId; title: string; author: string; about: string };

export type Poem = { id: string; book: BookId; title: string; lines: string[] };

export const BOOKS: Book[] = [
  {
    id: "ratnalabala",
    title: "రత్నాలబాల – జ్ఞానమాల",
    author: "మిరియాల వెంకటరత్నం",
    about: "జీవితానికి కావలసిన నీతిని నాలుగు పాదాల్లో చెప్పే పద్యాలు. ప్రతి పద్యం “భావరత్నబాల ! భాగ్యలీల !” అనే మకుటంతో ముగుస్తుంది.",
  },
  {
    id: "mira",
    title: "మిరా పద్యాలు",
    author: "డాక్టర్ మిరియాల రామకృష్ణ",
    about: "తెలుగు భాష, ప్రకృతి, పిల్లల లోకం మీద పాటలు, పద్యాలు.",
  },
];

export const getBook = (id: string) => BOOKS.find((b) => b.id === id);

const collator = new Intl.Collator("te");

function parse(text: string): { title: string; order: number; lines: string[] } {
  const m = text.replace(/^﻿/, "").match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  const head = m ? m[1] : "";
  const body = m ? m[2] : text;
  const title = head.match(/^title:\s*(.+)$/m)?.[1].trim().replace(/^["']|["']$/g, "") ?? "";
  const order = Number(head.match(/^order:\s*(\d+)/m)?.[1] ?? 0);
  const lines = body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .split("\n");
  return { title, order, lines };
}

export function getPoems(book: BookId): Poem[] {
  const dir = join(process.cwd(), "content", book);
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ file: f, ...parse(readFileSync(join(dir, f), "utf8")) }))
    .map((p) => ({ ...p, title: p.title || p.file.replace(/\.md$/, "") }))
    // book order first ("order:"), then by title
    .sort((a, b) => a.order - b.order || collator.compare(a.title, b.title))
    .map((p, i) => ({ id: `${book}-${i + 1}`, book, title: p.title, lines: p.lines }));
}

export const getAllPoems = () => BOOKS.flatMap((b) => getPoems(b.id));
