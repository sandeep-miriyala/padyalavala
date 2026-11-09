"use client";

import { useMemo, useState } from "react";
import type { GridColumn, YuktaiGridRule } from "@yuktishaalaa/yuktai";
import { MicIcon, PenIcon, SearchIcon } from "@yuktishaalaa/yuktai/icons";
import { AKSHARALU, TYPE_LABEL, type Akshara } from "@/data/akshara";
import Listen from "@/components/vy/Listen";
import TeluguGrid, { commonRules } from "@/components/vy/TeluguGrid";
import TracePad from "@/components/vy/TracePad";
import SayIt from "@/components/vy/SayIt";
import { useSpeak } from "@/components/vy/useSpeak";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
type Filter = "all" | "achchu" | "hallu";
type Tab = "listen" | "write" | "say";

type Row = { id: string; letter: string; type: string; word: string; picture: string };
const columns: GridColumn<Row>[] = [
  { key: "letter", label: "అక్షరం", sortable: true },
  { key: "word", label: "పదం", sortable: true },
  { key: "type", label: "రకం", type: "badge", sortable: true, filterable: true },
  { key: "picture", label: "బొమ్మ", type: "badge", hiddenOnMobile: true, filterable: true },
];
const rules: YuktaiGridRule<Row>[] = [
  { name: "achchulu", phrases: ["అచ్చులు", "అచ్చు", "స్వరాలు", "vowels"], description: "అచ్చులు మాత్రమే", execute: async ({ executeTool }) => (await executeTool("filter", { key: "type", operator: "equals", value: "అచ్చు" })).message },
  { name: "hallulu", phrases: ["హల్లులు", "హల్లు", "వ్యంజనాలు", "consonants"], description: "హల్లులు మాత్రమే", execute: async ({ executeTool }) => (await executeTool("filter", { key: "type", operator: "equals", value: "హల్లు" })).message },
  { name: "pictures", phrases: ["బొమ్మ ఉన్నవి", "బొమ్మలు", "pictures"], description: "బొమ్మ ఉన్న అక్షరాలు", execute: async ({ executeTool }) => (await executeTool("filter", { key: "picture", operator: "equals", value: "ఉంది" })).message },
  ...commonRules<Row>("అక్షరాలు"),
];

export default function Aksharamala() {
  const { speak, speaking, supported } = useSpeak();
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Akshara>(AKSHARALU[0]);
  const [tab, setTab] = useState<Tab>("listen");

  const shown = useMemo(() => {
    const s = q.trim();
    return AKSHARALU.filter((a) => (filter === "all" || a.type === filter) && (!s || a.letter.includes(s) || a.word.includes(s)));
  }, [filter, q]);

  const rows: Row[] = useMemo(
    () => AKSHARALU.map((a) => ({ id: a.id, letter: a.letter, type: TYPE_LABEL[a.type], word: a.word, picture: a.image ? "ఉంది" : "లేదు" })),
    [],
  );

  const choose = (a: Akshara) => {
    setPicked(a);
    setTab("listen");
    speak([a.letter, a.word], a.id);
    document.getElementById("akshara-focus")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {!supported && <p className="note-box">ఈ బ్రౌజర్‌లో తెలుగు స్వరం లేదు. వినడానికి Chrome / Edge, లేదా ఫోన్‌లో తెలుగు స్వరం ఇన్‌స్టాల్ చేయండి.</p>}

      <div id="akshara-focus" className="focus card" aria-live="polite">
        <div className="focus-main">
          <span className="focus-letter" lang="te">{picked.letter}</span>
          <div className="focus-info">
            <strong className="focus-word">{picked.word}</strong>
            <span className="muted">{TYPE_LABEL[picked.type]}</span>
            {picked.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="focus-img" src={`${base}${picked.image}`} alt={`${picked.word}: ${picked.letter} అక్షరం బొమ్మ`} width={180} height={246} />
            )}
          </div>
        </div>
        <div className="seg" role="tablist" aria-label="ఏం చేయాలి">
          <button type="button" role="tab" aria-selected={tab === "listen"} onClick={() => setTab("listen")}>వినండి</button>
          <button type="button" role="tab" aria-selected={tab === "write"} onClick={() => setTab("write")}><PenIcon size={16} aria-hidden="true" /> రాసి చూడండి</button>
          <button type="button" role="tab" aria-selected={tab === "say"} onClick={() => setTab("say")}><MicIcon size={16} aria-hidden="true" /> పలికి చూడండి</button>
        </div>
        <div className="focus-tool">
          {tab === "listen" && (
            <div className="btn-row">
              <Listen text={picked.letter} speaking={speaking} speak={speak} label="అక్షరం వినండి" />
              <Listen text={picked.word} speaking={speaking} speak={speak} label="పదం వినండి" />
              <Listen text={[picked.letter, `${picked.letter} అంటే ${picked.word}`]} id={`${picked.id}-both`} speaking={speaking} speak={speak} label="రెండూ వినండి" />
            </div>
          )}
          {tab === "write" && <TracePad key={picked.id} letter={picked.letter} />}
          {tab === "say" && <SayIt key={picked.id} word={picked.word} />}
        </div>
      </div>

      <div className="toolbar">
        <div className="seg" role="group" aria-label="వర్గం">
          {(["all", "achchu", "hallu"] as Filter[]).map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? "అన్నీ" : f === "achchu" ? "అచ్చులు" : "హల్లులు"}
            </button>
          ))}
        </div>
        <label className="search-box">
          <SearchIcon size={18} aria-hidden="true" />
          <span className="sr-only">అక్షరం లేదా పదం వెతకండి</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="అక్షరం లేదా పదం… ఉదా: ఏనుగు" />
        </label>
      </div>

      <ul className="letters" aria-label="అక్షరాలు">
        {shown.map((a) => (
          <li key={a.id}>
            <button type="button" className={`letter-card${picked.id === a.id ? " on" : ""}`} onClick={() => choose(a)} aria-label={`${a.letter}: ${a.word}`}>
              {a.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`${base}${a.image}`} alt="" loading="lazy" width={90} height={123} />
              ) : (
                <span className="letter-noimg" aria-hidden="true">{a.letter}</span>
              )}
              <span className="letter-big" aria-hidden="true">{a.letter}</span>
              <span className="letter-word" aria-hidden="true">{a.word}</span>
            </button>
          </li>
        ))}
      </ul>
      {!shown.length && <p className="note-box">“{q}” తో ఏ అక్షరమూ దొరకలేదు.</p>}

      <h2 className="vy-h2">అన్ని అక్షరాలు: YuktAI గ్రిడ్</h2>
      <p className="note-box">🤖 <strong>గ్రిడ్ AI సహాయకుడు:</strong> “అచ్చులు”, “హల్లులు”, “బొమ్మ ఉన్నవి”, “ఎన్ని”, “అన్నీ” అని టైప్ చేయండి లేదా 🎤 తో చెప్పండి. వరుస మీద నొక్కితే పైన తెరుచుకుంటుంది.</p>
      <TeluguGrid<Row>
        rows={rows}
        columns={columns}
        rowKey="id"
        rules={rules}
        toolName="aksharamala"
        onRowClick={(r) => choose(AKSHARALU.find((a) => a.id === r.id)!)}
      />
    </>
  );
}
