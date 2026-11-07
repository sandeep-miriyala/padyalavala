import Link from "next/link";
import { Reveal } from "@yuktishaalaa/yuktai/experience";
import {
  AccessibilityIcon, BookIcon, ChatIcon, GlobeIcon, GridIcon, InstallIcon, MicIcon, PaletteIcon,
  ReadingIcon, RobotIcon, SpeakerIcon, SpeedIcon, ToolsIcon, WifiOffIcon,
} from "@yuktishaalaa/yuktai/icons";
import config from "@config";
import { BOOKS, getAllPoems, getPoems } from "@/lib/poems";
import { LINKS } from "@/data/site";
import HeroAsk from "@/components/ui/HeroAsk";
import "@/styles/poems.css";

type Help = { icon: typeof ChatIcon; title: string; text: string; href?: string; on?: boolean };

// Everything below runs in the visitor's browser: no server, no API key, nothing sent anywhere.
const HELPS: Help[] = [
  { icon: GridIcon, title: "పద్యాల గ్రిడ్", text: "అన్ని పద్యాలు ఒకే జాబితాలో: వెతకండి, వరుసగా పెట్టండి, తెరవండి.", href: "/poems/" },
  { icon: RobotIcon, title: "గ్రిడ్ AI సహాయకుడు", text: "“మిరా పద్యాలు”, “పెద్ద పద్యాలు” అని టైప్ చేయండి: గ్రిడ్ తానే చేస్తుంది.", href: "/poems/" },
  { icon: MicIcon, title: "మాటతో వెతకండి", text: "🎤 నొక్కి తెలుగులో చెప్పండి. పేజీ పనులూ మాటతోనే (🛠).", href: "/poems/" },
  { icon: SpeedIcon, title: "Rust వేగం", text: "వెతుకులాట, వరుస Rust (WebAssembly) లో: క్షణంలో వెయ్యో వంతులో.", href: "/poems/" },
  { icon: ChatIcon, title: "ఈ పేజీని అడగండి", text: "Ctrl + K: జవాబు ఈ పేజీ నుంచే, మూలంతో సహా చూపిస్తుంది.", on: config.features.ask },
  { icon: SpeakerIcon, title: "వినండి", text: "ప్రతి పద్యాన్నీ తెలుగులో చదివి వినిపిస్తుంది." },
  { icon: AccessibilityIcon, title: "అందరికీ", text: "♿ బటన్: అక్షరాల పరిమాణం, కాంట్రాస్ట్, డిస్లెక్సియా ఫాంట్, రంగు-అంధత్వ ఫిల్టర్లు.", on: config.features.accessibility },
  { icon: PaletteIcon, title: "మీ రంగు, మీ ఫాంట్", text: "పైన కుడివైపు 🎨: ఏ రంగైనా, తెలుగు ఫాంట్ కూడా. అక్షరాలు ఎప్పుడూ స్పష్టంగానే.", on: config.theme.picker },
  { icon: GlobeIcon, title: "7 భాషల్లో మెనూ", text: "🌐 బటన్: తెలుగు, हिन्दी, தமிழ், ಕನ್ನಡ, മലയാളം, বাংলা, English. యానిమేషన్లు మీ ఇష్టం.", on: config.features.preferences },
  { icon: ToolsIcon, title: "పేజీ పనిముట్లు", text: "🛠 బటన్: QA రిపోర్ట్, ఫారం, డిజైన్ సమీక్ష, మాట ఆదేశాలు.", on: config.features.pageTools },
  { icon: InstallIcon, title: "యాప్‌గా పెట్టుకోండి", text: "ఫోన్‌లో, కంప్యూటర్‌లో యాప్ లాగా తెరుచుకుంటుంది.", on: config.features.pwa },
  { icon: WifiOffIcon, title: "ఇంటర్నెట్ లేకపోయినా", text: "ఒకసారి తెరిచాక పద్యాలు ఆఫ్‌లైన్‌లోనూ చదవవచ్చు.", on: config.features.pwa },
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
        {config.features.ask && <HeroAsk />}
        <div className="btn-row">
          <Link className="btn primary" href="/poems/"><ReadingIcon size={18} aria-hidden="true" /> అన్ని {all.length} పద్యాలు చదవండి</Link>
        </div>
      </section>

      <section className="wrap">
        <h2>సంపుటాలు</h2>
        <ul className="cards">
          {BOOKS.map((b, i) => (
            <Reveal as="li" key={b.id} delay={i * 80}>
              <Link className="card yk-lift" href={`/poems/${b.id}/`}>
                <span className="iconbox"><BookIcon size={22} aria-hidden="true" /></span>
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

      <section className="wrap" aria-labelledby="built-h">
        <div className="built card">
          <h2 id="built-h">YuktAI తో తయారైంది</h2>
          <p>
            ఈ సైట్ మొత్తం <strong>YuktAI</strong> తో తయారైంది: <strong>సందీప్ మిరియాల</strong> రూపొందించిన ఉచిత ఓపెన్-సోర్స్ (GPL-3.0) టూల్‌కిట్.
            గ్రిడ్, Rust వేగం, AI సహాయకుడు, అందరికీ అందుబాటు, ఐకాన్లు, భాషలు అన్నీ దాని నుంచే. ఒక్క command తో సైట్, GitHub Actions తో ప్రచురణ.
          </p>
          <p className="btn-row">
            <a className="btn" href={LINKS.github}>GitHub</a>
            <a className="btn" href={LINKS.docs}>డాక్స్</a>
          </p>
        </div>
      </section>
    </div>
  );
}
