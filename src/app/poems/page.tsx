import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@yuktishaalaa/yuktai/experience";
import { BOOKS, getAllPoems, getPoems } from "@/lib/poems";
import PoemFinder, { type Row } from "./PoemFinder";
import "@/styles/poems.css";

export const metadata: Metadata = { title: "పద్యాలు" };

export default function PoemsPage() {
  const rows: Row[] = getAllPoems().map((p) => ({
    id: p.id,
    book: p.book,
    bookTitle: BOOKS.find((b) => b.id === p.book)?.title ?? p.book,
    title: p.title,
    first: p.lines.find(Boolean) ?? "",
  }));

  return (
    <section className="wrap" lang="te">
      <p className="kicker">పద్యాలు</p>
      <h1>అన్ని పద్యాలు</h1>
      <p className="lead">{rows.length} పద్యాలు, {BOOKS.length} సంపుటాలు. శీర్షికతో గానీ పదంతో గానీ వెతకండి; పద్యం మీద నొక్కితే తెరుచుకుంటుంది.</p>

      <ul className="cards">
        {BOOKS.map((b, i) => (
          <Reveal as="li" key={b.id} delay={i * 80}>
            <Link className="card yk-lift" href={`/poems/${b.id}/`}>
              <strong>{b.title}</strong>
              <span>{b.author} · {getPoems(b.id).length} పద్యాలు</span>
            </Link>
          </Reveal>
        ))}
      </ul>

      <h2 className="poems-h2">వెతకండి</h2>
      <PoemFinder rows={rows} />
    </section>
  );
}
