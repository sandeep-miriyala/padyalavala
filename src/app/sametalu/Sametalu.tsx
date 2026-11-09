"use client";

import { useMemo, useState } from "react";
import type { GridColumn, YuktaiGridRule } from "@yuktishaalaa/yuktai";
import { CheckIcon, CopyIcon, QuoteIcon, ShareIcon, ShuffleIcon } from "@yuktishaalaa/yuktai/icons";
import type { Sametha } from "@/data/sametalu";
import Listen from "@/components/vy/Listen";
import TeluguGrid, { commonRules, startsWithRules } from "@/components/vy/TeluguGrid";
import { useSpeak } from "@/components/vy/useSpeak";
import { useDayIndex } from "@/components/vy/client";

const columns: GridColumn<Sametha>[] = [
  { key: "text", label: "సామెత", sortable: true },
  { key: "letter", label: "అక్షరం", type: "badge", sortable: true, filterable: true },
  { key: "words", label: "పదాలు", type: "number", sortable: true, align: "right", hiddenOnMobile: true },
];

function Actions({ s, speaking, speak }: { s: Sametha; speaking: string | null; speak: (t: string | string[], id?: string) => void }) {
  const [note, setNote] = useState("");
  const flash = (m: string) => {
    setNote(m);
    setTimeout(() => setNote(""), 2000);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${s.text}\n— తెలుగు సామెత`);
      flash("కాపీ అయింది");
    } catch {
      flash("కాపీ కాలేదు");
    }
  };
  const share = async () => {
    const text = `${s.text}\n— తెలుగు సామెత`;
    if (navigator.share) {
      try {
        await navigator.share({ text, url: location.href });
      } catch {
        /* closed */
      }
    } else window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${location.href}`)}`, "_blank", "noopener");
  };
  return (
    <div className="btn-row">
      <Listen text={s.text} id={s.id} speaking={speaking} speak={speak} />
      <button type="button" className="btn" onClick={copy}><CopyIcon size={18} aria-hidden="true" /> కాపీ</button>
      <button type="button" className="btn" onClick={share}><ShareIcon size={18} aria-hidden="true" /> పంచుకోండి</button>
      <span className="hint" role="status">{note && <><CheckIcon size={14} aria-hidden="true" /> {note}</>}</span>
    </div>
  );
}

export default function Sametalu({ rows, letters }: { rows: Sametha[]; letters: { letter: string; count: number }[] }) {
  const { speak, speaking } = useSpeak();
  const [letter, setLetter] = useState(letters[0]?.letter ?? "");
  // ఈ రోజు సామెత: తేదీని బట్టి, అందరికీ ఒకటే
  const day = useDayIndex(rows.length);
  const [other, setOther] = useState<number | null>(null); // "ఇంకొకటి" నొక్కితే
  const today = rows[other ?? day];
  const list = useMemo(() => rows.filter((r) => r.letter === letter), [rows, letter]);

  const rules: YuktaiGridRule<Sametha>[] = useMemo(
    () => [
      { name: "short", phrases: ["చిన్న సామెతలు", "చిన్నవి"], description: "చిన్న సామెతలు ముందు", execute: async ({ executeTool }) => (await executeTool("sort", { key: "words", direction: "asc" })).message },
      { name: "long", phrases: ["పెద్ద సామెతలు", "పెద్దవి", "పొడవైన"], description: "పెద్ద సామెతలు ముందు", execute: async ({ executeTool }) => (await executeTool("sort", { key: "words", direction: "desc" })).message },
      ...startsWithRules<Sametha>(letters.map((l) => l.letter), "text", "సామెతలు"),
      ...commonRules<Sametha>("సామెతలు"),
    ],
    [letters],
  );

  return (
    <>
      {today && (
        <div className="card today" aria-labelledby="today-h">
          <h2 id="today-h" className="vy-h3"><QuoteIcon size={20} aria-hidden="true" /> ఈ రోజు సామెత</h2>
          <blockquote className="sametha-big">{today.text}</blockquote>
          <div className="btn-row">
            <Actions s={today} speaking={speaking} speak={speak} />
            <button type="button" className="btn" onClick={() => setOther(Math.floor(Math.random() * rows.length))}><ShuffleIcon size={18} aria-hidden="true" /> ఇంకొకటి</button>
          </div>
        </div>
      )}

      <div className="card pick">
        <h2 className="vy-h3" id="letter-h">అక్షరం ఎంచుకోండి</h2>
        <ul className="chips" aria-labelledby="letter-h">
          {letters.map((l) => (
            <li key={l.letter}>
              <button type="button" className="chip" aria-pressed={l.letter === letter} onClick={() => setLetter(l.letter)}>
                {l.letter} <span className="chip-count">{l.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="vy-h2">“{letter}” తో సామెతలు ({list.length})</h2>
      <ol className="sametha-list">
        {list.map((s) => (
          <li key={s.id} className="card">
            <p className="sametha">{s.text}</p>
            <Actions s={s} speaking={speaking} speak={speak} />
          </li>
        ))}
      </ol>

      <h2 className="vy-h2">అన్ని సామెతలు: YuktAI గ్రిడ్</h2>
      <p className="note-box">🤖 <strong>గ్రిడ్ AI సహాయకుడు:</strong> “అ తో మొదలయ్యే సామెతలు”, “చిన్న సామెతలు”, “ఎన్ని సామెతలు”, “అన్నీ” అని టైప్ చేయండి లేదా 🎤 తో చెప్పండి. ఒక పదం టైప్ చేస్తే ఆ పదం ఉన్న సామెతలన్నీ వస్తాయి. వరుస నొక్కితే చదివి వినిపిస్తుంది.</p>
      <TeluguGrid<Sametha> rows={rows} columns={columns} rowKey="id" rules={rules} toolName="sametalu" onRowClick={(r) => speak(r.text, r.id)} />
    </>
  );
}
