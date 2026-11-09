import type { Metadata } from "next";
import Link from "next/link";
import { BookIcon } from "@yuktishaalaa/yuktai/icons";
import { BOOKS, getAllPadyalu, getPadyalu } from "@/data/shatakamu";
import Shatakamu, { type Row } from "./Shatakamu";
import "@/styles/vy.css";

export const metadata: Metadata = { title: "శతకమాల", description: "11 తెలుగు శతకాలు: సుమతీ, దాశరథీ, శ్రీకాళహస్తీశ్వర, టీ శతకం… చదవండి, వినండి, వెతకండి." };

export default function Page() {
  const all = getAllPadyalu();
  const rows: Row[] = all.map((p) => ({ id: p.id, book: p.book, bookTitle: p.bookTitle, num: p.num, text: p.text, lines: p.lines, bhavam: p.meaning ? "ఉంది" : "" }));
  return (
    <section className="wrap" lang="te">
      <p className="kicker">సాహిత్యం</p>
      <h1>శతకమాల</h1>
      <p className="lead">{BOOKS.length} శతకాలు, {all.length} పద్యాలు. శతకం ఎంచుకోండి, లేదా ఒక్క పదంతో అన్ని పద్యాల్లో వెతకండి.</p>

      <ul className="cards">
        {BOOKS.map((b) => (
          <li key={b.id}>
            <Link className="card yk-lift" href={`/shatakamu/${b.id}/`}>
              <span className="iconbox"><BookIcon size={22} aria-hidden="true" /></span>
              <strong>{b.title}</strong>
              <span>{b.author}</span>
              <span className="muted">{getPadyalu(b.id).length} పద్యాలు</span>
            </Link>
          </li>
        ))}
      </ul>

      <Shatakamu rows={rows} books={BOOKS.map((b) => ({ id: b.id, title: b.title, aliases: b.aliases }))} />
    </section>
  );
}
