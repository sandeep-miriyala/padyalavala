import Link from "next/link";
import { Reveal } from "@yuktishaalaa/yuktai/experience";
import { AccessibilityIcon, ChatIcon, InstallIcon, SearchIcon } from "@yuktishaalaa/yuktai/icons";
import config from "@config";
import { BOOKS, getAllPoems, getPoems } from "@/lib/poems";
import "@/styles/poems.css";

const HELPS = [
  { icon: SearchIcon, title: "వెతకండి", text: "శీర్షికతో, పదంతో అన్ని పద్యాల్లో వెతకండి.", href: "/poems/" },
  { icon: ChatIcon, title: "ఈ పేజీని అడగండి", text: "Ctrl + K నొక్కి ప్రశ్న అడగండి. జవాబు ఈ పేజీ నుంచే వస్తుంది.", on: config.features.ask },
  { icon: AccessibilityIcon, title: "అందరికీ", text: "♿ బటన్: అక్షరాల పరిమాణం, కాంట్రాస్ట్, డిస్లెక్సియా ఫాంట్.", on: config.features.accessibility },
  { icon: InstallIcon, title: "ఫోన్‌లో పెట్టుకోండి", text: "ఒకసారి తెరిచాక ఇంటర్నెట్ లేకపోయినా చదవవచ్చు.", on: config.features.pwa },
];

export default function Home() {
  const all = getAllPoems();
  const today = all[new Date().getDate() % all.length];

  return (
    <div lang="te">
      <section className="wrap hero">
        <p className="kicker">తెలుగు పద్యాలు</p>
        <h1 className="yk-pop">{config.title}</h1>
        <p className="lead">{config.description}</p>
        <div className="btn-row">
          <Link className="btn primary" href="/poems/">అన్ని పద్యాలు చదవండి</Link>
        </div>
      </section>

      <section className="wrap">
        <h2>సంపుటాలు</h2>
        <ul className="cards">
          {BOOKS.map((b, i) => (
            <Reveal as="li" key={b.id} delay={i * 80}>
              <Link className="card yk-lift" href={`/poems/${b.id}/`}>
                <strong>{b.title}</strong>
                <span>{b.author} · {getPoems(b.id).length} పద్యాలు</span>
                <span>{b.about}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {today && (
        <section className="wrap" aria-labelledby="today-h">
          <h2 id="today-h" className="poems-h2">ఈ రోజు పద్యం</h2>
          <Reveal>
            <article className="poem card">
              <h3>{today.title}</h3>
              <p className="poem-text">{today.lines.join("\n")}</p>
              <Link href={`/poems/${today.book}/#${today.id}`}>పూర్తి సంపుటి చూడండి →</Link>
            </article>
          </Reveal>
        </section>
      )}

      <section className="wrap">
        <h2 className="poems-h2">ఈ సైట్‌లో</h2>
        <ul className="cards">
          {HELPS.filter((h) => h.on !== false).map((h, i) => {
            const inner = (
              <>
                <span className="iconbox"><h.icon size={22} aria-hidden="true" /></span>
                <strong>{h.title}</strong>
                <span>{h.text}</span>
              </>
            );
            return (
              <Reveal as="li" key={h.title} delay={(i % 3) * 80}>
                {h.href ? <Link className="card yk-lift" href={h.href}>{inner}</Link> : <div className="card">{inner}</div>}
              </Reveal>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
