"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "@yuktishaalaa/yuktai/icons";
import PadyamActions from "@/components/vy/PadyamActions";
import { useSpeak } from "@/components/vy/useSpeak";

type P = { id: string; num: number; text: string; meaning: string };

/** ఒక శతకంలోని అన్ని పద్యాలు: పదంతో వెతుకులాట, వినండి, కాపీ, పంచుకోండి. */
export default function BookPoems({ title, author, poems }: { title: string; author: string; poems: P[] }) {
  const { speak, speaking } = useSpeak();
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim();
    return s ? poems.filter((p) => p.text.includes(s) || p.meaning.includes(s) || String(p.num) === s) : poems;
  }, [poems, q]);

  return (
    <>
      <div className="toolbar">
        <label className="search-box">
          <SearchIcon size={18} aria-hidden="true" />
          <span className="sr-only">ఈ శతకంలో వెతకండి</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="పదం లేదా పద్యం సంఖ్య" />
        </label>
        <span className="muted" role="status">{list.length} పద్యాలు</span>
      </div>
      <ol className="padyam-list">
        {list.map((p) => (
          <li key={p.id} id={p.id} className="card padyam-card">
            <h2 className="vy-h3">పద్యం {p.num}</h2>
            <p className="padyam">{p.text}</p>
            {p.meaning && (
              <details className="bhavam">
                <summary>భావం</summary>
                <p>{p.meaning}</p>
              </details>
            )}
            <PadyamActions id={p.id} title={`${title}: పద్యం ${p.num}`} text={p.text} author={author} speaking={speaking} speak={speak} />
          </li>
        ))}
      </ol>
    </>
  );
}
