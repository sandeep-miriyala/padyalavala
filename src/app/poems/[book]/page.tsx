import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@yuktishaalaa/yuktai/experience";
import { BOOKS, getBook, getPoems } from "@/lib/poems";
import PoemActions from "./PoemActions";
import "@/styles/poems.css";

// Static export: one page per book, made at build time.
export const dynamicParams = false;
export const generateStaticParams = () => BOOKS.map((b) => ({ book: b.id }));

type Props = { params: Promise<{ book: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = getBook((await params).book);
  return { title: book?.title ?? "పద్యాలు", description: book?.about };
}

export default async function BookPage({ params }: Props) {
  const book = getBook((await params).book);
  if (!book) notFound();
  const poems = getPoems(book.id);

  return (
    <section className="wrap" lang="te">
      <p className="kicker"><Link href="/poems/">పద్యాలు</Link></p>
      <h1>{book.title}</h1>
      <p className="lead">{book.author} · {poems.length} పద్యాలు. {book.about}</p>

      <nav aria-label="పద్యాల జాబితా" className="poem-toc">
        <ol>
          {poems.map((p) => (
            <li key={p.id}><a href={`#${p.id}`}>{p.title}</a></li>
          ))}
        </ol>
      </nav>

      <div className="poem-list">
        {poems.map((p, i) => (
          <Reveal key={p.id} delay={(i % 2) * 60}>
            <article id={p.id} className="poem card" aria-labelledby={`${p.id}-h`}>
              <h2 id={`${p.id}-h`}>{p.title}</h2>
              <p className="poem-text">{p.lines.join("\n")}</p>
              <PoemActions title={p.title} text={p.lines.join("\n")} author={book.author} />
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
