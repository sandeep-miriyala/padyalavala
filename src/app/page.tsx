import Link from "next/link";
import { Reveal } from "@yuktishaalaa/yuktai/experience";
import {
  AbcIcon, AccessibilityIcon, BookIcon, ChatIcon, GlobeIcon, InstallIcon, JoinIcon, MergeIcon, MicIcon,
  HeartIcon, PaletteIcon, PenIcon, QuoteIcon, ReadingIcon, RobotIcon, SchoolIcon, SpeakerIcon, SpeedIcon, SpellcheckIcon, ToolsIcon, WifiOffIcon,
} from "@yuktishaalaa/yuktai/icons";
import config from "@config";
import HeroAsk from "@/components/ui/HeroAsk";
import TodaySametha from "@/components/vy/TodaySametha";
import { VYAKARANAM, SAHITYAM, LINKS } from "@/data/site";
import { getSametalu } from "@/data/sametalu";
import "@/styles/vy.css";

const ICONS: Record<string, typeof AbcIcon> = {
  aksharamala: AbcIcon,
  guninta: SpellcheckIcon,
  padalu: BookIcon,
  sametalu: QuoteIcon,
  sandhi: JoinIcon,
  samasa: MergeIcon,
  shatakamu: ReadingIcon,
  kathamala: SchoolIcon,
  ankitham: HeartIcon,
};

type Help = { icon: typeof AbcIcon; title: string; text: string; on?: boolean };

// అన్నీ సందర్శకుడి బ్రౌజర్‌లోనే: సర్వర్ లేదు, API key లేదు, ఏదీ ఎక్కడికీ పంపదు.
const HELPS: Help[] = [
  { icon: SpeakerIcon, title: "వినండి", text: "ప్రతి అక్షరం, పదం, సామెత: ఫోనే తెలుగులో చదివి వినిపిస్తుంది." },
  { icon: PenIcon, title: "రాసి చూడండి", text: "అక్షరమాలలో వేలితో అక్షరం రాయండి: Rust సరిచూసి చెబుతుంది." },
  { icon: MicIcon, title: "పలికి చూడండి, మాటతో వెతకండి", text: "పదం పలికితే సరిగ్గా పలికారో చెబుతుంది. గ్రిడ్‌లో 🎤 తో తెలుగులో అడగండి." },
  { icon: RobotIcon, title: "గ్రిడ్ AI సహాయకుడు", text: "“క గుణింతం”, “మూడు అక్షరాల పదాలు”, “స్వర సంధి” అని రాస్తే గ్రిడ్ తానే చేస్తుంది.", on: config.features.grid },
  { icon: SpeedIcon, title: "Rust వేగం", text: "వెతుకులాట, వరుస, రాత సరిచూడడం Rust (WebAssembly) లో: క్షణంలో." },
  { icon: ChatIcon, title: "ఈ పేజీని అడగండి", text: "Ctrl + K: జవాబు ఈ పేజీ నుంచే, మూలంతో సహా.", on: config.features.ask },
  { icon: AccessibilityIcon, title: "అందరికీ", text: "♿ బటన్: పెద్ద అక్షరాలు, కాంట్రాస్ట్, సులువుగా చదివే ఫాంట్, రంగు-అంధత్వ ఫిల్టర్లు.", on: config.features.accessibility },
  { icon: PaletteIcon, title: "మీ రంగు, మీ ఫాంట్", text: "పైన 🎨: ఏ రంగైనా, ఏ ఫాంట్ అయినా. అక్షరాలు ఎప్పుడూ స్పష్టంగానే.", on: config.theme.picker },
  { icon: GlobeIcon, title: "7 భాషల్లో మెనూ", text: "🌐 బటన్: తెలుగు, हिन्दी, தமிழ், ಕನ್ನಡ, മലയാളം, বাংলা, English.", on: config.features.preferences },
  { icon: ToolsIcon, title: "పేజీ పనిముట్లు", text: "🛠 బటన్: QA రిపోర్ట్, మాట ఆదేశాలు.", on: config.features.pageTools },
  { icon: InstallIcon, title: "యాప్‌గా పెట్టుకోండి", text: "ఫోన్‌లో, కంప్యూటర్‌లో యాప్‌లా తెరుచుకుంటుంది. Play Store అక్కర్లేదు.", on: config.features.pwa },
  { icon: WifiOffIcon, title: "ఇంటర్నెట్ లేకపోయినా", text: "ఒకసారి తెరిచాక పాఠాలన్నీ ఆఫ్‌లైన్‌లోనూ పనిచేస్తాయి.", on: config.features.pwa },
];

export default function Home() {
  const sametalu = getSametalu();
  // ఈ రోజు సామెత కోసం 60 చిన్న సామెతలు చాలు: పేజీ తేలికగా ఉంటుంది
  const today = sametalu.filter((s) => s.words <= 8).filter((_, i) => i % 7 === 0).slice(0, 60).map((s) => s.text);

  return (
    <div lang="te">
      <section className="wrap hero">
        <p className="kicker">తెలుగు నేర్చుకోవడానికి ఒక ఇల్లు</p>
        <h1 className="yk-pop">{config.title}</h1>
        <p className="lead">వ్యాకరణం: అక్షరాలు, గుణింతాలు, పదాలు, సామెతలు, సంధులు, సమాసాలు. సాహిత్యం: 11 శతకాలు, పిల్లల కథలు. చదవండి, వినండి, రాసి చూడండి. పిల్లలకు, పెద్దలకు, అందరికీ ఉచితం.</p>
        {config.features.ask && <HeroAsk />}
        <div className="btn-row">
          <Link className="btn primary" href="/aksharamala/"><AbcIcon size={18} aria-hidden="true" /> అక్షరమాలతో మొదలుపెట్టండి</Link>
        </div>
      </section>

      <section className="wrap" aria-labelledby="vy-h">
        <h2 id="vy-h">📖 వ్యాకరణం</h2>
        <ul className="cards">
          {VYAKARANAM.children.map((m, i) => {
            const Icon = ICONS[m.key] ?? BookIcon;
            return (
              <Reveal as="li" key={m.href} delay={(i % 3) * 80}>
                <Link className="card yk-lift" href={m.href}>
                  <span className="iconbox"><Icon size={22} aria-hidden="true" /></span>
                  <strong>{m.label}</strong>
                  <span>{m.hint}</span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <section className="wrap" aria-labelledby="sa-h">
        <h2 id="sa-h">📚 సాహిత్యం</h2>
        <ul className="cards">
          {SAHITYAM.children.map((m, i) => {
            const Icon = ICONS[m.key] ?? BookIcon;
            return (
              <Reveal as="li" key={m.href} delay={(i % 3) * 80}>
                <Link className="card yk-lift" href={m.href}>
                  <span className="iconbox"><Icon size={22} aria-hidden="true" /></span>
                  <strong>{m.label}</strong>
                  <span>{m.hint}</span>
                </Link>
              </Reveal>
            );
          })}
          <Reveal as="li" delay={240}>
            <a className="card yk-lift" href={LINKS.padyalavala}>
              <span className="iconbox"><BookIcon size={22} aria-hidden="true" /></span>
              <strong>పద్యాలవాల</strong>
              <span>రత్నాలబాల పద్యాలు, మిరా పద్యాలు: వేరే సైట్‌లో</span>
            </a>
          </Reveal>
        </ul>
      </section>

      <section className="wrap" aria-label="ఈ రోజు సామెత">
        <TodaySametha list={today} />
      </section>

      <section className="wrap" aria-labelledby="help-h">
        <h2 id="help-h" className="vy-h2">ఈ సైట్‌లో</h2>
        <ul className="cards">
          {HELPS.filter((h) => h.on !== false).map((h, i) => (
            <Reveal as="li" key={h.title} delay={(i % 3) * 80}>
              <div className="card">
                <span className="iconbox"><h.icon size={22} aria-hidden="true" /></span>
                <strong>{h.title}</strong>
                <span>{h.text}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="wrap" aria-labelledby="next-h">
        <div className="card soon">
          <h2 id="next-h">త్వరలో</h2>
          <p>📚 మిగతా సాహిత్యం (గీత, జ్ఞానమాల, స్మృతిమాల), 🎨 కళలు (ఖతిమాల, చిత్రమాల, స్వరమాల, లిపిమాల) కూడా ఇలాగే YuktAI తో కొత్తగా వస్తాయి. అప్పటి వరకు అవి <a href={LINKS.oldSite}>పాత రత్నాలబాలలో</a> ఉంటాయి.</p>
        </div>
      </section>
    </div>
  );
}
