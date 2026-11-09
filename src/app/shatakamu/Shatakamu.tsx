"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { GridColumn, YuktaiGridRule } from "@yuktishaalaa/yuktai";
import { ReadingIcon, ShuffleIcon } from "@yuktishaalaa/yuktai/icons";
import TeluguGrid, { commonRules } from "@/components/vy/TeluguGrid";
import PadyamActions from "@/components/vy/PadyamActions";
import { useSpeak } from "@/components/vy/useSpeak";
import { useDayIndex } from "@/components/vy/client";

export type Row = { id: string; book: string; bookTitle: string; num: number; text: string; lines: number; bhavam: string };
type BookLite = { id: string; title: string; aliases: string[] };

const columns: GridColumn<Row>[] = [
  { key: "text", label: "పద్యం", sortable: true },
  { key: "bookTitle", label: "శతకం", type: "badge", sortable: true, filterable: true },
  { key: "num", label: "సంఖ్య", type: "number", sortable: true, align: "right", hiddenOnMobile: true },
  { key: "bhavam", label: "భావం", type: "badge", filterable: true, hiddenOnMobile: true },
];

export default function Shatakamu({ rows, books }: { rows: Row[]; books: BookLite[] }) {
  const router = useRouter();
  const { speak, speaking } = useSpeak();
  // ఈ రోజు పద్యం: తేదీని బట్టి, అందరికీ ఒకటే
  const day = useDayIndex(rows.length);
  const [other, setOther] = useState<number | null>(null);
  const today = rows[other ?? day];

  const rules: YuktaiGridRule<Row>[] = useMemo(
    () => [
      // "సుమతీ పద్యాలు", "దాశరథీ", "టీ శతకం"…
      ...books.map((b) => {
        const title = rows.find((r) => r.book === b.id)?.bookTitle ?? b.title;
        return {
          name: `book-${b.id}`,
          phrases: [b.title, ...b.aliases.flatMap((a) => [a, `${a} పద్యాలు`, `${a} శతకం`])],
          description: `${b.title} పద్యాలు మాత్రమే`,
          execute: async ({ executeTool }) => (await executeTool("filter", { key: "bookTitle", operator: "equals", value: title })).message,
        } satisfies YuktaiGridRule<Row>;
      }),
      { name: "meaning", phrases: ["భావం ఉన్నవి", "భావంతో", "అర్థం ఉన్నవి"], description: "భావం ఉన్న పద్యాలు", execute: async ({ executeTool }) => (await executeTool("filter", { key: "bhavam", operator: "equals", value: "ఉంది" })).message },
      { name: "first", phrases: ["మొదటి పద్యాలు", "వరుసగా"], description: "సంఖ్య ప్రకారం", execute: async ({ executeTool }) => (await executeTool("sort", { key: "num", direction: "asc" })).message },
      ...commonRules<Row>("పద్యాలు"),
    ],
    [books, rows],
  );

  return (
    <>
      {today && (
        <div className="card today" aria-labelledby="today-h">
          <h2 id="today-h" className="vy-h3"><ReadingIcon size={20} aria-hidden="true" /> ఈ రోజు పద్యం</h2>
          <p className="muted">{today.bookTitle} · పద్యం {today.num}</p>
          <p className="padyam">{today.text}</p>
          <div className="btn-row">
            <PadyamActions id={today.id} title={`${today.bookTitle}: పద్యం ${today.num}`} text={today.text} author={today.bookTitle} speaking={speaking} speak={speak} />
            <button type="button" className="btn" onClick={() => setOther(Math.floor(Math.random() * rows.length))}><ShuffleIcon size={18} aria-hidden="true" /> ఇంకొకటి</button>
            <Link className="btn" href={`/shatakamu/${today.book}/#${today.id}`}>పూర్తి శతకం →</Link>
          </div>
        </div>
      )}

      <h2 className="vy-h2">అన్ని పద్యాలు: YuktAI గ్రిడ్</h2>
      <p className="note-box">🤖 <strong>గ్రిడ్ AI సహాయకుడు:</strong> “సుమతీ పద్యాలు”, “దాశరథీ”, “టీ శతకం”, “భావం ఉన్నవి”, “ఎన్ని పద్యాలు”, “అన్నీ” అని టైప్ చేయండి లేదా 🎤 తో చెప్పండి. ఒక పదం టైప్ చేస్తే అన్ని శతకాల్లో ఆ పదం ఉన్న పద్యాలు Rust వేగంతో వస్తాయి. వరుస నొక్కితే ఆ పద్యం తెరుచుకుంటుంది.</p>
      <TeluguGrid<Row> rows={rows} columns={columns} rowKey="id" rules={rules} toolName="shatakamu" onRowClick={(r) => router.push(`/shatakamu/${r.book}/#${r.id}`)} />
    </>
  );
}
