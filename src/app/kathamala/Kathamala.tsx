"use client";

import { useMemo, useState } from "react";
import type { GridColumn, YuktaiGridRule } from "@yuktishaalaa/yuktai";
import { BulbIcon } from "@yuktishaalaa/yuktai/icons";
import type { Katha } from "@/data/kathamala";
import Listen from "@/components/vy/Listen";
import TeluguGrid, { commonRules } from "@/components/vy/TeluguGrid";
import { useSpeak } from "@/components/vy/useSpeak";

const columns: GridColumn<Katha>[] = [
  { key: "title", label: "కథ", sortable: true },
  { key: "age", label: "వయసు", type: "badge", sortable: true, filterable: true },
  { key: "moral", label: "నీతి", hiddenOnMobile: true },
  { key: "size", label: "వాక్యాలు", type: "number", sortable: true, align: "right", hiddenOnMobile: true },
];

export default function Kathamala({ rows, ages }: { rows: Katha[]; ages: { age: string; count: number }[] }) {
  const { speak, speaking } = useSpeak();
  const [age, setAge] = useState(ages[0]?.age ?? "");
  const [open, setOpen] = useState<string | null>(null);
  const list = useMemo(() => rows.filter((r) => r.age === age), [rows, age]);
  const story = rows.find((r) => r.id === open);

  const rules: YuktaiGridRule<Katha>[] = useMemo(
    () => [
      ...ages.map((a) => ({
        name: `age-${a.age}`,
        phrases: [a.age, `${a.age} కథలు`, `${Number.parseInt(a.age, 10)} ఏళ్ల పిల్లలకు`],
        description: `${a.age} పిల్లల కథలు`,
        execute: async ({ executeTool }) => (await executeTool("filter", { key: "age", operator: "equals", value: a.age })).message,
      }) satisfies YuktaiGridRule<Katha>),
      { name: "short", phrases: ["చిన్న కథలు", "చిన్నవి"], description: "చిన్న కథలు ముందు", execute: async ({ executeTool }) => (await executeTool("sort", { key: "size", direction: "asc" })).message },
      { name: "long", phrases: ["పెద్ద కథలు", "పెద్దవి"], description: "పెద్ద కథలు ముందు", execute: async ({ executeTool }) => (await executeTool("sort", { key: "size", direction: "desc" })).message },
      ...commonRules<Katha>("కథలు"),
    ],
    [ages],
  );

  const show = (id: string) => {
    setOpen(id);
    requestAnimationFrame(() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <>
      <div className="card pick">
        <h2 className="vy-h3" id="age-h">వయసు ఎంచుకోండి</h2>
        <ul className="chips" aria-labelledby="age-h">
          {ages.map((a) => (
            <li key={a.age}>
              <button type="button" className="chip" aria-pressed={a.age === age} onClick={() => setAge(a.age)}>
                {a.age} <span className="chip-count">{a.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {story && (
        <article id="story" className="card focus" aria-labelledby="story-h">
          <p className="muted">{story.age}</p>
          <h2 id="story-h" className="vy-h2" style={{ margin: 0 }}>{story.title}</h2>
          <div className="katha">{story.lines.map((l, i) => <p key={i}>{l}</p>)}</div>
          {story.moral && <p className="note-box"><BulbIcon size={18} aria-hidden="true" /> <strong>నీతి:</strong> {story.moral}</p>}
          <div className="btn-row">
            <Listen text={[story.title, ...story.lines, story.moral ? `నీతి: ${story.moral}` : ""].filter(Boolean)} id={story.id} label="కథ వినండి" speaking={speaking} speak={speak} />
          </div>
        </article>
      )}

      <h2 className="vy-h2">{age} పిల్లల కథలు ({list.length})</h2>
      <ul className="word-cards katha-cards">
        {list.map((k) => (
          <li key={k.id}>
            <button type="button" className={`word-card${open === k.id ? " on" : ""}`} onClick={() => show(k.id)}>
              <strong>{k.title}</strong>
              <span>{k.lines[0]}</span>
            </button>
          </li>
        ))}
      </ul>

      <h2 className="vy-h2">అన్ని కథలు: YuktAI గ్రిడ్</h2>
      <p className="note-box">🤖 <strong>గ్రిడ్ AI సహాయకుడు:</strong> “5-7 ఏళ్లు”, “చిన్న కథలు”, “ఎన్ని కథలు”, “అన్నీ” అని టైప్ చేయండి లేదా 🎤 తో చెప్పండి. ఒక పదం టైప్ చేస్తే ఆ పదం ఉన్న కథలు వస్తాయి. వరుస నొక్కితే కథ తెరుచుకుంటుంది.</p>
      <TeluguGrid<Katha> rows={rows} columns={columns} rowKey="id" rules={rules} toolName="kathamala" onRowClick={(r) => { setAge(r.age); show(r.id); }} />
    </>
  );
}
