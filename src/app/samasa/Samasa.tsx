"use client";

import type { GridColumn, YuktaiGridRule } from "@yuktishaalaa/yuktai";
import { SAMASA_RULES } from "@/data/bhashaMala";
import { detectSamasa } from "@/lib/samasaDetector";
import Detector from "@/components/vy/Detector";
import Listen from "@/components/vy/Listen";
import TeluguGrid, { commonRules } from "@/components/vy/TeluguGrid";
import { useSpeak } from "@/components/vy/useSpeak";

type Rule = (typeof SAMASA_RULES)[number];
type Sub = { name: string; example: string; vigraha: string };

// గ్రిడ్: ప్రతి సమాసం యొక్క రకాలు, ఉదాహరణలు ఒక్కో వరుసగా
type Row = { id: string; samasam: string; vigraha: string; peru: string; rakam: string };
const ROWS: Row[] = SAMASA_RULES.flatMap((r) => [
  ...((("subtypes" in r ? r.subtypes : []) as Sub[]).map((s, i) => ({ id: `${r.id}-s${i}`, samasam: s.example, vigraha: s.vigraha, peru: r.name, rakam: s.name }))),
  ...r.examples.map((e, i) => ({ id: `${r.id}-e${i}`, samasam: e.samasa, vigraha: e.vigraha, peru: r.name, rakam: "ఉదాహరణ" })),
]);
const columns: GridColumn<Row>[] = [
  { key: "samasam", label: "సమాస పదం", sortable: true },
  { key: "vigraha", label: "విగ్రహ వాక్యం" },
  { key: "peru", label: "సమాసం", type: "badge", sortable: true, filterable: true },
  { key: "rakam", label: "రకం", sortable: true, hiddenOnMobile: true },
];
const rules: YuktaiGridRule<Row>[] = [
  ...SAMASA_RULES.map((r) => {
    const short = r.name.replace(/ సమాసము$/, "");
    return {
      name: `samasa-${r.id}`,
      phrases: [r.name, `${short} సమాసం`, short],
      description: `${r.name} మాత్రమే`,
      execute: async ({ executeTool }: { executeTool: (n: string, i?: Record<string, unknown>) => Promise<{ message: string }> }) => (await executeTool("filter", { key: "peru", operator: "equals", value: r.name })).message,
    };
  }),
  ...commonRules<Row>("సమాసాలు"),
];

const SAMPLES = ["పెద్ద గుఱ్ఱము", "రాజభటుడు", "చెట్టుకొమ్మ", "పీతాంబరుడు", "త్రిలోకి", "రామకృష్ణులు", "అజ్ఞానము", "యథావిధి", "కమలాక్షుడు", "తల్లిదండ్రులు", "దేవాలయము", "పంచభూతాలు"];

function RuleCard({ r, speaking, speak }: { r: Rule; speaking: string | null; speak: (t: string | string[], id?: string) => void }) {
  const subs = ("subtypes" in r ? r.subtypes : []) as Sub[];
  return (
    <article className="card rule" id={`samasa-${r.id}`}>
      <header className="rule-head">
        <span className="rule-no">{r.id}</span>
        <h3>{r.name}</h3>
        <span className="badge">{r.pradhanyam}</span>
      </header>
      <p className="rule-text">{r.definition}</p>
      <p className="hint"><strong>విగ్రహ వాక్యం:</strong> {r.vigrahyaVakya}</p>
      {subs.length > 0 && (
        <details className="subs">
          <summary>{subs.length} రకాలు</summary>
          <ul className="examples">
            {subs.map((s) => (
              <li key={s.name}>
                <span className="muted">{s.name}:</span> <strong>{s.example}</strong> <span aria-hidden="true">=</span> <span>{s.vigraha}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
      <ul className="examples">
        {r.examples.map((e) => (
          <li key={e.samasa}>
            <strong>{e.samasa}</strong> <span aria-hidden="true">=</span> <span>{e.vigraha}</span>
            <Listen text={`${e.samasa}, అంటే ${e.vigraha}`} id={`${r.id}-${e.samasa}`} speaking={speaking} speak={speak} small />
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Samasa() {
  const { speak, speaking } = useSpeak();
  return (
    <>
      <Detector
        label="సమాస పదం ఇవ్వండి: ఏ సమాసమో చెబుతాను"
        placeholder="ఉదా: రాజభటుడు"
        samples={SAMPLES}
        onCheck={(w) => {
          const res = detectSamasa(w);
          if (!res.detected) return <p className="note-box">“{w}” కి సరిపడే సమాసం దొరకలేదు. కింద ఉన్న సమాసాలు చూడండి, లేదా వేరే పదం ఇవ్వండి.</p>;
          return (
            <div className="card rule">
              <p className="detect-answer">“{w}”: <strong>{res.samasaName}</strong>{res.subtype ? ` (${res.subtype})` : ""}</p>
              <dl className="rule-parts">
                <div><dt>పూర్వ పదం</dt><dd>{res.purvapadam || "—"}</dd></div>
                <div><dt>ఉత్తర పదం</dt><dd>{res.uttarapadam || "—"}</dd></div>
                <div><dt>ప్రాధాన్యం</dt><dd>{res.pradhanyam}</dd></div>
              </dl>
              <p className="rule-text"><strong>విగ్రహ వాక్యం:</strong> {res.vigraha}</p>
              <div className="btn-row">
                <Listen text={`${w}, అంటే ${res.vigraha}. ఇది ${res.samasaName}`} id={`detect-${w}`} speaking={speaking} speak={speak} />
              </div>
            </div>
          );
        }}
      />

      <h2 className="vy-h2">సమాసాలు</h2>
      <div className="rules">
        {SAMASA_RULES.map((r) => <RuleCard key={r.id} r={r} speaking={speaking} speak={speak} />)}
      </div>

      <h2 className="vy-h2">సమాస పదాలు: YuktAI గ్రిడ్</h2>
      <p className="note-box">🤖 <strong>గ్రిడ్ AI సహాయకుడు:</strong> “ద్వంద్వ సమాసం”, “బహువ్రీహి”, “తత్పురుష”, “ఎన్ని సమాసాలు”, “అన్నీ” అని టైప్ చేయండి లేదా 🎤 తో చెప్పండి. వరుస నొక్కితే చదివి వినిపిస్తుంది.</p>
      <TeluguGrid<Row> rows={ROWS} columns={columns} rowKey="id" rules={rules} toolName="samasa" onRowClick={(r) => speak(`${r.samasam}, అంటే ${r.vigraha}`, r.id)} />
    </>
  );
}
