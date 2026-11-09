import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BOOKS, getPadyalu } from "@/data/shatakamu";
import BookPoems from "./BookPoems";
import "@/styles/vy.css";

export function generateStaticParams() {
  return BOOKS.map((b) => ({ book: b.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ book: string }> }): Promise<Metadata> {
  const { book } = await params;
  const b = BOOKS.find((x) => x.id === book);
  return b ? { title: b.title, description: `${b.title}: ${b.author}. ${getPadyalu(b.id).length} పద్యాలు, చదవండి, వినండి.` } : {};
}

export default async function Page({ params }: { params: Promise<{ book: string }> }) {
  const { book } = await params;
  const b = BOOKS.find((x) => x.id === book);
  if (!b) notFound();
  const poems = getPadyalu(b.id).map((p) => ({ id: p.id, num: p.num, text: p.text, meaning: p.meaning }));
  return (
    <section className="wrap" lang="te">
      <p className="kicker"><Link href="/shatakamu/">శతకమాల</Link></p>
      <h1>{b.title}</h1>
      <p className="lead">{b.author} · {poems.length} పద్యాలు</p>
      <BookPoems title={b.title} author={b.author} poems={poems} />
    </section>
  );
}
