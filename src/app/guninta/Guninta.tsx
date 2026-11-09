"use client";

import { useMemo, useState } from "react";
import type { GridColumn, YuktaiGridRule } from "@yuktishaalaa/yuktai";
import { GUNINTA_MARKS, GUNINTA_NAMES, GUNINTA_SWARALU, GUNINTA_VYANJANALU } from "@/data/bhashaMala";
import Listen from "@/components/vy/Listen";
import TeluguGrid, { commonRules } from "@/components/vy/TeluguGrid";
import { useSpeak } from "@/components/vy/useSpeak";

type Row = { id: string; hallu: string; aksharam: string; peru: string; achchu: string; order: number };

const ROWS: Row[] = GUNINTA_VYANJANALU.flatMap((h, i) =>
  GUNINTA_MARKS.map((m, j) => ({ id: `${i}-${j}`, hallu: h, aksharam: h + m, peru: GUNINTA_NAMES[j], achchu: GUNINTA_SWARALU[j], order: i * 100 + j })),
);

const columns: GridColumn<Row>[] = [
  { key: "aksharam", label: "అక్షరం", sortable: true },
  { key: "hallu", label: "హల్లు", type: "badge", sortable: true, filterable: true },
  { key: "achchu", label: "అచ్చు", sortable: true },
  { key: "peru", label: "గుణింతం పేరు", sortable: true, filterable: true, hiddenOnMobile: true },
];

const rules: YuktaiGridRule<Row>[] = [
  ...GUNINTA_VYANJANALU.map((h) => ({
    name: `hallu-${h}`,
    phrases: [`${h} గుణింతం`, `${h} గుణింతము`, `${h} హల్లు`],
    description: `${h} గుణింతం మాత్రమే`,
    execute: async ({ executeTool }: { executeTool: (n: string, i?: Record<string, unknown>) => Promise<{ message: string }> }) => (await executeTool("filter", { key: "hallu", operator: "equals", value: h })).message,
  })),
  ...GUNINTA_NAMES.map((n) => ({
    name: `mark-${n}`,
    phrases: [n, `${n} అక్షరాలు`],
    description: `${n} ఉన్న అక్షరాలు`,
    execute: async ({ executeTool }: { executeTool: (n: string, i?: Record<string, unknown>) => Promise<{ message: string }> }) => (await executeTool("filter", { key: "peru", operator: "equals", value: n })).message,
  })),
  ...commonRules<Row>("అక్షరాలు"),
];

export default function Guninta() {
  const { speak, speaking } = useSpeak();
  const [hallu, setHallu] = useState(GUNINTA_VYANJANALU[0]);
  const forms = useMemo(() => GUNINTA_MARKS.map((m, j) => ({ text: hallu + m, name: GUNINTA_NAMES[j], achchu: GUNINTA_SWARALU[j] })), [hallu]);

  return (
    <>
      <div className="card pick">
        <h2 className="vy-h3" id="hallu-h">హల్లు ఎంచుకోండి</h2>
        <ul className="chips" aria-labelledby="hallu-h">
          {GUNINTA_VYANJANALU.map((h) => (
            <li key={h}>
              <button type="button" className="chip" aria-pressed={h === hallu} onClick={() => setHallu(h)}>{h}</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="section-head">
        <h2 className="vy-h2">“{hallu}” గుణింతం</h2>
        <Listen text={forms.map((f) => f.text)} id={`all-${hallu}`} speaking={speaking} speak={speak} label="మొత్తం వినండి" />
      </div>
      <ul className="forms" aria-label={`${hallu} గుణింతం`}>
        {forms.map((f) => (
          <li key={f.text}>
            <button type="button" className={`form-card${speaking === f.text ? " on" : ""}`} onClick={() => speak(f.text)} aria-label={`${f.text}: ${f.name}. వినండి`}>
              <span className="form-big" aria-hidden="true">{f.text}</span>
              <span className="form-sum" aria-hidden="true">{hallu} + {f.achchu}</span>
              <span className="form-name" aria-hidden="true">{f.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <h2 className="vy-h2">మొత్తం గుణింతాలు: YuktAI గ్రిడ్</h2>
      <p className="note-box">🤖 <strong>గ్రిడ్ AI సహాయకుడు:</strong> “క గుణింతం”, “ఆకారము”, “విసర్గ”, “ఎన్ని”, “అన్నీ” అని టైప్ చేయండి లేదా 🎤 తో చెప్పండి. వరుస నొక్కితే ఆ అక్షరం వినిపిస్తుంది. {ROWS.length} అక్షరాల్లో వెతుకులాట Rust లో.</p>
      <TeluguGrid<Row> rows={ROWS} columns={columns} rowKey="id" rules={rules} toolName="guninta" pageSize={16} onRowClick={(r) => speak(r.aksharam)} />
    </>
  );
}
