import type { Metadata } from "next";
import config from "@config";
import { BOOKS, getPoems } from "@/lib/poems";

export const metadata: Metadata = { title: "గురించి" };

const HOW: [string, string][] = [
  ["తయారీ", "YuktAI: సందీప్ మిరియాల రూపొందించిన ఓపెన్-సోర్స్ టూల్‌కిట్ (GPL-3.0), Next.js"],
  ["గ్రిడ్", "YuktaiGrid: వెతుకులాట, వరుస Rust (WebAssembly) లో. గ్రిడ్ AI సహాయకుడు, మాటతో వెతుకులాట, WebMCP"],
  ["అడగండి", "@yuktishaalaa/ask-page: జవాబు ఈ పేజీ నుంచే, Rust వెతుకులాటతో, మీ పరికరంలోనే"],
  ["రూపం", "🎨 రంగు, ఫాంట్ · 🌐 7 భాషల మెనూ · చీకటి థీమ్ · 175 YuktAI ఐకాన్లలోంచి"],
  ["పద్యాలు", "ప్రతి పద్యం ఒక చిన్న టెక్స్ట్ ఫైల్ (content/ ఫోల్డర్)"],
  ["ప్రచురణ", "GitHub Actions: మార్పు చేయగానే సైట్ దానంతట అదే తయారవుతుంది"],
  ["గోప్యత", "మీరు టైప్ చేసేది ఎక్కడికీ వెళ్ళదు. అంతా మీ బ్రౌజర్‌లోనే"],
  ["అందరికీ", "♿ బటన్: అక్షరాల పరిమాణం, కాంట్రాస్ట్, డిస్లెక్సియా ఫాంట్"],
];

export default function About() {
  return (
    <section className="wrap">
      <p className="kicker">గురించి</p>
      <h1>{config.title} గురించి</h1>
      <p className="lead">మిరియాల కుటుంబం రాసిన తెలుగు పద్యాలు, అందరూ చదవగలిగేలా, వినగలిగేలా.</p>
      <ul className="cards">
        {BOOKS.map((b) => (
          <li key={b.id} className="card">
            <strong>{b.title}</strong>
            <span>రచయిత: {b.author}</span>
            <span>{getPoems(b.id).length} పద్యాలు. {b.about}</span>
          </li>
        ))}
      </ul>
      <h2 className="poems-h2">ఈ సైట్ ఎలా తయారైంది</h2>
      <div className="table-box">
        <table>
          <caption className="sr-only">ఈ సైట్ ఎలా తయారైంది</caption>
          <tbody>{HOW.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
