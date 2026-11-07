import type { Metadata } from "next";
import config from "@config";
import { BOOKS, getPoems } from "@/lib/poems";

export const metadata: Metadata = { title: "గురించి" };

const STACK: [string, string][] = [
  ["Framework", "Next.js (static export: plain files on GitHub Pages)"],
  ["Toolkit", "@yuktishaalaa/yuktai: grid, accessibility, icons, languages"],
  ["Ask this page", "@yuktishaalaa/ask-page: answers from the page, on the device"],
  ["Poems", "content/<book>/*.md, read at build time"],
];

export default function About() {
  return (
    <section className="wrap">
      <div lang="te">
        <p className="kicker">గురించి</p>
        <h1>{config.title} గురించి</h1>
        <p className="lead">మిరియాల కుటుంబం రాసిన తెలుగు పద్యాలు, అందరూ చదవగలిగేలా.</p>
        <ul className="cards">
          {BOOKS.map((b) => (
            <li key={b.id} className="card">
              <strong>{b.title}</strong>
              <span>రచయిత: {b.author}</span>
              <span>{getPoems(b.id).length} పద్యాలు. {b.about}</span>
            </li>
          ))}
        </ul>
      </div>
      <h2 className="poems-h2">Built with YuktAI</h2>
      <p>Everything runs in the visitor&apos;s browser. Nothing they type is sent anywhere.</p>
      <div className="table-box">
        <table>
          <caption className="sr-only">What this site is built with</caption>
          <thead><tr><th scope="col">Part</th><th scope="col">Tool</th></tr></thead>
          <tbody>{STACK.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
