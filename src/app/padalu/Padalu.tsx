"use client";

import { useMemo, useState } from "react";
import type { GridColumn, YuktaiGridRule } from "@yuktishaalaa/yuktai";
import { PADALU_SWARALU, PADALU_VYANJANALU, THREE_FOUR_LETTER, TWO_LETTER } from "@/data/bhashaMala";
import { aksharalu } from "@/lib/akshara";
import Listen from "@/components/vy/Listen";
import TeluguGrid, { commonRules, startsWithRules } from "@/components/vy/TeluguGrid";
import { useSpeak } from "@/components/vy/useSpeak";

type Row = { id: string; padam: string; first: string; split: string; count: number };

const ROWS: Row[] = [...new Set([...TWO_LETTER, ...THREE_FOUR_LETTER])].map((w, i) => {
  const a = aksharalu(w);
  return { id: `p${i}`, padam: w, first: w[0], split: a.join(" + "), count: a.length };
});

const columns: GridColumn<Row>[] = [
  { key: "padam", label: "పదం", sortable: true },
  { key: "split", label: "అక్షరాలుగా", hiddenOnMobile: true },
  { key: "count", label: "అక్షరాలు", type: "number", sortable: true, filterable: true, align: "right" },
  { key: "first", label: "మొదటి అక్షరం", type: "badge", sortable: true, filterable: true },
];

const sizeRule = (n: number, word: string): YuktaiGridRule<Row> => ({
  name: `size-${n}`,
  phrases: [`${word} అక్షరాల పదాలు`, `${word} అక్షరాలు`, `${n} అక్షరాలు`],
  description: `${word} అక్షరాల పదాలు`,
  execute: async ({ executeTool }) => (await executeTool("filter", { key: "count", operator: "equals", value: n })).message,
});

const rules: YuktaiGridRule<Row>[] = [
  sizeRule(2, "రెండు"),
  sizeRule(3, "మూడు"),
  sizeRule(4, "నాలుగు"),
  { name: "long", phrases: ["పెద్ద పదాలు", "పొడవైన పదాలు"], description: "పెద్ద పదాలు ముందు", execute: async ({ executeTool }) => (await executeTool("sort", { key: "count", direction: "desc" })).message },
  { name: "short", phrases: ["చిన్న పదాలు"], description: "చిన్న పదాలు ముందు", execute: async ({ executeTool }) => (await executeTool("sort", { key: "count", direction: "asc" })).message },
  ...startsWithRules<Row>([...PADALU_SWARALU, ...PADALU_VYANJANALU], "padam", "పదాలు"),
  ...commonRules<Row>("పదాలు"),
];

export default function Padalu() {
  const { speak, speaking } = useSpeak();
  const [letter, setLetter] = useState<string | null>(null);
  const [open, setOpen] = useState<Row | null>(ROWS[0]);
  const shown = useMemo(() => (letter ? ROWS.filter((r) => r.padam.startsWith(letter)) : ROWS), [letter]);
  const has = (l: string) => ROWS.some((r) => r.padam.startsWith(l));

  const pick = (r: Row) => {
    setOpen(r);
    speak(r.padam);
  };

  const letterChips = (title: string, list: string[]) => (
    <div>
      <h3 className="vy-h4">{title}</h3>
      <ul className="chips">
        {list.filter(has).map((l) => (
          <li key={l}>
            <button type="button" className="chip" aria-pressed={letter === l} onClick={() => setLetter(letter === l ? null : l)}>{l}</button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      {open && (
        <div className="focus card" aria-live="polite">
          <div className="focus-main">
            <span className="focus-letter word" lang="te">{open.padam}</span>
            <div className="focus-info">
              <span className="muted">అక్షరాలుగా</span>
              <ul className="split" aria-label={`${open.padam}: అక్షరాలు`}>
                {aksharalu(open.padam).map((a, i) => (
                  <li key={i}>
                    <button type="button" className="chip" onClick={() => speak(a)} aria-label={`${a}: వినండి`}>{a}</button>
                  </li>
                ))}
              </ul>
              <span className="muted">{open.count} అక్షరాలు</span>
            </div>
          </div>
          <div className="btn-row">
            <Listen text={open.padam} speaking={speaking} speak={speak} label="పదం వినండి" />
            <Listen text={[...aksharalu(open.padam), open.padam]} id={`${open.id}-slow`} speaking={speaking} speak={speak} label="అక్షరం అక్షరంగా" />
          </div>
        </div>
      )}

      <div className="card pick">
        <div className="section-head">
          <h2 className="vy-h3">మొదటి అక్షరం</h2>
          {letter && <button type="button" className="btn" onClick={() => setLetter(null)}>అన్నీ చూపించండి</button>}
        </div>
        {letterChips("అచ్చులు", PADALU_SWARALU)}
        {letterChips("హల్లులు", PADALU_VYANJANALU)}
      </div>

      <h2 className="vy-h2">{letter ? `“${letter}” తో మొదలయ్యే పదాలు` : "అన్ని పదాలు"} ({shown.length})</h2>
      <ul className="word-cards">
        {shown.map((r) => (
          <li key={r.id}>
            <button type="button" className={`word-card${open?.id === r.id ? " on" : ""}`} onClick={() => pick(r)}>
              <strong>{r.padam}</strong>
              <span>{r.split}</span>
            </button>
          </li>
        ))}
      </ul>

      <h2 className="vy-h2">పదాలు: YuktAI గ్రిడ్</h2>
      <p className="note-box">🤖 <strong>గ్రిడ్ AI సహాయకుడు:</strong> “మూడు అక్షరాల పదాలు”, “క తో మొదలయ్యే పదాలు”, “పెద్ద పదాలు”, “ఎన్ని”, “అన్నీ” అని టైప్ చేయండి లేదా 🎤 తో చెప్పండి.</p>
      <TeluguGrid<Row> rows={ROWS} columns={columns} rowKey="id" rules={rules} toolName="padalu" onRowClick={pick} />
    </>
  );
}
