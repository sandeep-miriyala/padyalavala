"use client";

import { useMemo, useState } from "react";
import type { GridColumn, YuktaiGridRule } from "@yuktishaalaa/yuktai";
import { SANDHI_RULES } from "@/data/bhashaMala";
import { detectSandhi } from "@/lib/sandhiDetector";
import Detector from "@/components/vy/Detector";
import Listen from "@/components/vy/Listen";
import TeluguGrid, { commonRules } from "@/components/vy/TeluguGrid";
import { useSpeak } from "@/components/vy/useSpeak";

type Rule = (typeof SANDHI_RULES)[number];
const CATEGORIES = [...new Set(SANDHI_RULES.map((r) => r.category))];

type Row = { id: number; name: string; category: string; example: string; result: string };
const ROWS: Row[] = SANDHI_RULES.map((r) => ({
  id: r.id,
  name: r.name,
  category: r.category,
  example: r.examples.map((e) => `${e.before} = ${e.after}`).join(" · "),
  result: r.result,
}));
const columns: GridColumn<Row>[] = [
  { key: "id", label: "సంఖ్య", type: "number", sortable: true, align: "right" },
  { key: "name", label: "సంధి", sortable: true },
  { key: "category", label: "రకం", type: "badge", sortable: true, filterable: true },
  { key: "example", label: "ఉదాహరణ", hiddenOnMobile: true },
];
const rules: YuktaiGridRule<Row>[] = [
  ...CATEGORIES.map((c) => ({
    name: `cat-${c}`,
    phrases: [c, `${c}లు`, `${c} మాత్రమే`],
    description: `${c} మాత్రమే`,
    execute: async ({ executeTool }: { executeTool: (n: string, i?: Record<string, unknown>) => Promise<{ message: string }> }) => (await executeTool("filter", { key: "category", operator: "equals", value: c })).message,
  })),
  ...commonRules<Row>("సంధులు"),
];

const SAMPLES = SANDHI_RULES.flatMap((r) => r.examples.slice(0, 1).map((e) => e.after)).slice(0, 12);

function RuleCard({ r, speaking, speak }: { r: Rule; speaking: string | null; speak: (t: string | string[], id?: string) => void }) {
  return (
    <article className="card rule" id={`sandhi-${r.id}`}>
      <header className="rule-head">
        <span className="rule-no">{r.id}</span>
        <h3>{r.name}</h3>
        <span className="badge">{r.category}</span>
      </header>
      <p className="rule-text">{r.rule}</p>
      <dl className="rule-parts">
        <div><dt>పూర్వం</dt><dd>{r.purva}</dd></div>
        <div><dt>పరం</dt><dd>{r.para}</dd></div>
        <div><dt>ఫలితం</dt><dd>{r.result}</dd></div>
      </dl>
      <ul className="examples">
        {r.examples.map((e) => (
          <li key={e.before}>
            <span>{e.before}</span> <span aria-hidden="true">→</span> <strong>{e.after}</strong>
            <Listen text={`${e.before.replace("+", "కలిపితే")}, ${e.after}`} id={`${r.id}-${e.after}`} speaking={speaking} speak={speak} small />
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Sandhi() {
  const { speak, speaking } = useSpeak();
  const [cat, setCat] = useState<string | null>(null);
  const shown = useMemo(() => SANDHI_RULES.filter((r) => !cat || r.category === cat), [cat]);

  return (
    <>
      <Detector
        label="పదం ఇవ్వండి: ఏ సంధో చెబుతాను"
        placeholder="ఉదా: దేవేంద్ర"
        samples={SAMPLES}
        onCheck={(w) => {
          const res = detectSandhi(w);
          if (!res.detected)
            return <p className="note-box">“{w}” లో తెలిసిన సంధి నియమం దొరకలేదు. కింద ఉన్న 26 సంధులు చూడండి, లేదా వేరే పదం ఇవ్వండి.</p>;
          const r = SANDHI_RULES.find((x) => x.id === res.sandhiId)!;
          return (
            <>
              <p className="detect-answer">“{w}”: <strong>{res.sandhiName}</strong> ({res.category}) అయి ఉండవచ్చు.</p>
              <RuleCard r={r} speaking={speaking} speak={speak} />
            </>
          );
        }}
      />

      <div className="toolbar">
        <div className="seg wrap-seg" role="group" aria-label="సంధి రకం">
          <button type="button" aria-pressed={!cat} onClick={() => setCat(null)}>అన్నీ</button>
          {CATEGORIES.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      </div>

      <h2 className="vy-h2">{cat ?? "అన్ని సంధులు"} ({shown.length})</h2>
      <div className="rules">
        {shown.map((r) => <RuleCard key={r.id} r={r} speaking={speaking} speak={speak} />)}
      </div>

      <h2 className="vy-h2">సంధులు: YuktAI గ్రిడ్</h2>
      <p className="note-box">🤖 <strong>గ్రిడ్ AI సహాయకుడు:</strong> “స్వర సంధి”, “ఆగమ సంధి”, “తెలుగు సంధి”, “ఎన్ని సంధులు”, “అన్నీ” అని టైప్ చేయండి లేదా 🎤 తో చెప్పండి. వరుస నొక్కితే ఆ సంధికి వెళ్తుంది.</p>
      <TeluguGrid<Row>
        rows={ROWS}
        columns={columns}
        rowKey="id"
        rules={rules}
        toolName="sandhi"
        onRowClick={(r) => {
          setCat(null);
          setTimeout(() => document.getElementById(`sandhi-${r.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
        }}
      />
    </>
  );
}
