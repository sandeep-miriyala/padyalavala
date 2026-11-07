import type { Metadata } from "next";
import config from "@config";
import { BOOKS, getPoems } from "@/lib/poems";
import "@/styles/poems.css";

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

// Time saved with YuktAI: estimates for one mid-level React/Next.js developer, not measurements.
type Row = [task: string, scratch: string, yuktai: string];
type Level = { title: string; rows: Row[]; total: [string, string] };

const LEVELS: Level[] = [
  {
    title: "1. ప్రాజెక్ట్ సెటప్",
    rows: [
      ["Next.js project, static export, folders", "3–4 గం", "1 command (2 ని)"],
      ["Header, menu, submenu (keyboard తో), footer", "6–8 గం", "సిద్ధం"],
      ["GitHub Actions deploy, base path", "3–4 గం", "--host github-pages"],
    ],
    total: ["12–16 గం", "~10 ని"],
  },
  {
    title: "2. అందరికీ అందుబాటు (Accessibility)",
    rows: [
      ["♿ widget: text size, contrast, dyslexia font, colour-blind filters", "24–32 గం", "సిద్ధం"],
      ["Keyboard, focus, skip link, screen reader labels", "8–12 గం", "సిద్ధం"],
      ["🛠 Page tools: 15 WCAG checks QA report, form review, voice commands", "40–60 గం", "pageTools: true"],
    ],
    total: ["72–104 గం", "0"],
  },
  {
    title: "3. డేటా గ్రిడ్, Rust",
    rows: [
      ["Grid: search, sort, pages, phone cards", "16–24 గం", "సిద్ధం"],
      ["Rust → WebAssembly search/sort, TypeScript fallback, tests", "40–80 గం", 'engine="rust"'],
      ["తెలుగు సరైన sorting, 10,00,000 number format", "6–8 గం", "సిద్ధం"],
    ],
    total: ["62–112 గం", "~1 గం"],
  },
  {
    title: "4. ఏజెంటిక్ AI (బ్రౌజర్‌లోనే)",
    rows: [
      ["Grid AI Assistant: phrases → tools, multi-step", "30–40 గం", "6 తెలుగు rules (~30 ని)"],
      ["🎤 Voice, 22 భారతీయ భాషలు", "12–16 గం", "voice"],
      ["Ask this page: RAG, sources highlight, Rust search", "40–60 గం", "ask: true"],
      ["WebMCP: browser agents కి grid tools", "10–16 గం", "webmcp"],
    ],
    total: ["92–132 గం", "~30 ని"],
  },
  {
    title: "5. రూపం, భాషలు",
    rows: [
      ["🌐 7 భాషల menu, language picker", "10–14 గం", "సిద్ధం (~30 ని అనువాదం)"],
      ["🎨 Colour picker (7:1 contrast), fonts", "10–14 గం", "సిద్ధం (~20 ని అనువాదం)"],
      ["Dark theme, animations, reveal", "8–10 గం", "సిద్ధం"],
      ["Splash screen", "3–4 గం", "splash"],
      ["175 icons (SVG, React, accessible)", "16–24 గం", "import"],
    ],
    total: ["47–66 గం", "~1 గం"],
  },
  {
    title: "6. యాప్, టెస్టింగ్",
    rows: [
      ["PWA: install button, offline, service worker", "10–14 గం", "సిద్ధం"],
      ["Site tests", "3–4 గం", "సిద్ధం"],
    ],
    total: ["13–18 గం", "0"],
  },
  {
    title: "7. పద్యాలవాల కి ప్రత్యేకమైన పని (రెండు దారుల్లోనూ ఒకటే)",
    rows: [
      ["పద్యాలు .md ఫైళ్లుగా, పద్యాల pages, copy / share / listen", "4–6 గం", "4–6 గం"],
      ["SQL → markdown (27 మిరా పద్యాలు)", "1 గం", "1 గం"],
      ["తెలుగు అనువాదాలు, పరీక్షలు", "2–3 గం", "2–3 గం"],
    ],
    total: ["7–10 గం", "7–10 గం"],
  },
];

const SUMMARY: Row[] = [
  ["Framework పని (స్థాయి 1–6)", "300–450 గం", "~3 గం"],
  ["సైట్‌కు ప్రత్యేకమైన పని (స్థాయి 7)", "7–10 గం", "7–10 గం"],
  ["మొత్తం", "~310–460 గం", "~10–13 గం"],
  ["రోజుకు 8 గంటలు చొప్పున", "8–11 వారాలు (2–3 నెలలు)", "1–2 రోజులు"],
];

const NOTES: [string, string][] = [
  ["ఎవరూ పూర్తిగా సున్నా నుంచి తయారు చేయరు.", "సాధారణంగా MUI, AG Grid, i18next, Workbox, react-icons లాంటి libraries కలిపి వాడతారు. అప్పుడు స్థాయి 1–6 కి 100–150 గంటలు పడుతుంది. ఆ పోలికలో కూడా YuktAI సుమారు 95% వేగం. Rust గ్రిడ్, తెలుగు గ్రిడ్ AI సహాయకుడు, WebMCP, ఉచిత RAG ఆ libraries లో రెడీగా దొరకవు."],
  ["YuktAI తయారీకి పెట్టిన సమయం ఒక్కసారి పెట్టుబడి.", "ప్రతి కొత్త సైట్ (రత్నాలబాల, శతకాలు, సామెతలు) తో అది తిరిగి వస్తుంది."],
  ["YuktAI తో కూడా కొంత పని మిగిలింది.", "తెలుగు అనువాదాలు, ♿ widget లో ఇంకా ఇంగ్లీష్ labels. Library లో తెలుగు interface వస్తే ఇది కూడా తగ్గుతుంది."],
];

function Table({ rows, total, caption }: { rows: Row[]; total?: [string, string]; caption: string }) {
  return (
    <div className="table-box">
      <table>
        <caption className="sr-only">{caption}</caption>
        <thead><tr><th scope="col">పని</th><th scope="col">సున్నా నుంచి</th><th scope="col">YuktAI తో</th></tr></thead>
        <tbody>
          {rows.map(([task, a, b]) => <tr key={task}><th scope="row">{task}</th><td>{a}</td><td>{b}</td></tr>)}
          {total && <tr className="row-total"><th scope="row">మొత్తం</th><td>{total[0]}</td><td>{total[1]}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

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

      <h2 className="poems-h2" id="time-saved">YuktAI తో ఎంత సమయం ఆదా అయింది?</h2>
      <p>
        ఈ సైట్‌ను సున్నా నుంచి తయారు చేస్తే ఎంత పడుతుంది, YuktAI తో ఎంత పట్టింది అనే పోలిక. ఇవి అంచనాలు మాత్రమే, కొలిచినవి కావు:
        React, Next.js తెలిసిన ఒక మధ్యస్థ అనుభవం ఉన్న డెవలపర్ ఆధారంగా, Claude (AI) సహాయంతో చేసిన విశ్లేషణ.
      </p>
      <ul className="stats">
        <li><strong>310–460</strong><span>గంటలు: సున్నా నుంచి</span></li>
        <li><strong>10–13</strong><span>గంటలు: YuktAI తో</span></li>
        <li><strong>95–97%</strong><span>సమయం ఆదా</span></li>
        <li><strong>₹2.5–6.5 లక్షలు</strong><span>ఆదా అయిన పని విలువ (గంటకు ₹800–1,500)</span></li>
      </ul>

      <h3 className="poems-h3">స్థాయి వారీగా</h3>
      {LEVELS.map((l) => (
        <details key={l.title} className="level">
          <summary><span>{l.title}</span><span className="level-sum">{l.total[0]} → {l.total[1]}</span></summary>
          <Table rows={l.rows} total={l.total} caption={l.title} />
        </details>
      ))}

      <h3 className="poems-h3">మొత్తం పోలిక</h3>
      <Table rows={SUMMARY} caption="మొత్తం పోలిక" />

      <h3 className="poems-h3">న్యాయంగా చెప్పాల్సినవి</h3>
      <ol className="notes">
        {NOTES.map(([head, text]) => <li key={head}><strong>{head}</strong> {text}</li>)}
      </ol>
      <p className="note-box"><strong>ఒక్క వాక్యంలో:</strong> పద్యాలవాల సున్నా నుంచి తయారు చేస్తే 2–3 నెలలు; YuktAI తో ఒక్క సాయంత్రం.</p>
    </section>
  );
}
