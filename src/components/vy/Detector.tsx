"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { SearchIcon, WandIcon } from "@yuktishaalaa/yuktai/icons";

type Props = {
  label: string;
  placeholder: string;
  samples: string[];
  onCheck: (word: string) => ReactNode;
};

/** పదం ఇస్తే నియమం ఊహించే పెట్టె (సంధి, సమాసం). నియమాలు బ్రౌజర్‌లోనే: సర్వర్ లేదు. */
export default function Detector({ label, placeholder, samples, onCheck }: Props) {
  const [q, setQ] = useState("");
  const [word, setWord] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setWord(q.trim());
  };
  return (
    <div className="card detector">
      <form className="detector-form" onSubmit={submit} role="search">
        <label htmlFor="detect-q" className="vy-h3"><WandIcon size={20} aria-hidden="true" /> {label}</label>
        <div className="detector-row">
          <input id="detect-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} autoComplete="off" lang="te" />
          <button type="submit" className="btn primary"><SearchIcon size={18} aria-hidden="true" /> గుర్తించండి</button>
        </div>
      </form>
      <p className="hint">ఉదాహరణలు:</p>
      <ul className="chips">
        {samples.map((s) => (
          <li key={s}>
            <button
              type="button"
              className="chip"
              onClick={() => {
                setQ(s);
                setWord(s);
              }}
            >
              {s}
            </button>
          </li>
        ))}
      </ul>
      <div aria-live="polite">{word && onCheck(word)}</div>
    </div>
  );
}
