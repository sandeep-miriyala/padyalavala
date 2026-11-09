import type { Metadata } from "next";
import config from "@config";
import { LINKS } from "@/data/site";
import "@/styles/vy.css";

export const metadata: Metadata = { title: "గురించి" };

const HOW: [string, string][] = [
  ["తయారీ", "YuktAI: సందీప్ మిరియాల రూపొందించిన ఓపెన్-సోర్స్ టూల్‌కిట్ (GPL-3.0), Next.js. npm create yuktai --host vercel అనే ఒక్క command తో మొదలైంది"],
  ["గ్రిడ్", "YuktaiGrid: ప్రతి మాలలో. వెతుకులాట, వరుస Rust (WebAssembly) లో; గ్రిడ్ AI సహాయకుడు తెలుగు మాటలు అర్థం చేసుకుంటాడు; 🎤 మాటతో; WebMCP"],
  ["రాత సరిచూడడం", "అక్షరమాలలో రాసిన అక్షరాన్ని Rust (WebAssembly) సరిచూస్తుంది. ఇంతకుముందు ఇది Python సర్వర్‌లో జరిగేది; ఇప్పుడు మీ ఫోన్‌లోనే"],
  ["వినడం", "బ్రౌజర్‌లోని తెలుగు స్వరం (te-IN). సర్వర్ లేదు"],
  ["అడగండి", "@yuktishaalaa/ask-page: జవాబు ఈ పేజీ నుంచే, మీ పరికరంలోనే (Ctrl + K)"],
  ["రూపం", "🎨 రంగు, ఫాంట్ · 🌐 7 భాషల మెనూ · చీకటి థీమ్ · YuktAI ఐకాన్లు"],
  ["అందరికీ", "♿ బటన్: అక్షరాల పరిమాణం, కాంట్రాస్ట్, డిస్లెక్సియా ఫాంట్, రంగు-అంధత్వ ఫిల్టర్లు"],
  ["యాప్", "PWA: యాప్‌గా పెట్టుకోవచ్చు, ఇంటర్నెట్ లేకపోయినా పనిచేస్తుంది"],
  ["ప్రచురణ", "Vercel: GitHub కి push చేయగానే సైట్ దానంతట అదే తయారవుతుంది"],
];

export default function About() {
  return (
    <section className="wrap" lang="te">
      <p className="kicker">గురించి</p>
      <h1>{config.title} గురించి</h1>
      <p className="lead">
        మా తాతగారు మిరియాల వెంకటరత్నం గారి పద్యాలతో మొదలైన కుటుంబ ప్రయత్నం: తెలుగు సాహిత్యానికి, తెలుగు నేర్చుకోవడానికి ఒక ఇల్లు. పూర్తిగా ఉచితం.
      </p>
      <p>
        ఇది రత్నాలబాల కొత్త రూపం. మొదట <strong>వ్యాకరణం</strong> (ఆరు మాలలు) YuktAI తో కొత్తగా తయారైంది. సాహిత్యం, కళలు త్వరలో వస్తాయి;
        అప్పటి వరకు అవి <a href={LINKS.oldSite}>పాత రత్నాలబాలలో</a> ఉంటాయి.
      </p>

      <h2 className="vy-h2">గోప్యత</h2>
      <p>
        మీరు టైప్ చేసేది, రాసే అక్షరాలు, ఎంచుకునే రంగులు: అన్నీ మీ బ్రౌజర్‌లోనే. ఏదీ ఎక్కడికీ పంపము, ఎవరినీ లెక్కపెట్టము (analytics లేదు).
        “పలికి చూడండి” లో మాత్రం మీ మాటను మీ బ్రౌజర్ గుర్తిస్తుంది: Chrome లో అది Google సేవ ద్వారా జరుగుతుంది. ఈ సైట్ దాన్ని దాచుకోదు.
      </p>

      <h2 className="vy-h2">ఈ సైట్ ఎలా తయారైంది</h2>
      <div className="table-box">
        <table>
          <caption className="sr-only">ఈ సైట్ ఎలా తయారైంది</caption>
          <tbody>{HOW.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="note-box">
        తప్పులు, సూచనలు తప్పకుండా చెప్పండి. <strong>— సందీప్ మిరియాల</strong> · <a href={LINKS.github}>YuktAI (GitHub)</a> · <a href={LINKS.docs}>డాక్స్</a>
      </p>
    </section>
  );
}
