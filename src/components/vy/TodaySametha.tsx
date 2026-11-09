"use client";

import Link from "next/link";
import { QuoteIcon } from "@yuktishaalaa/yuktai/icons";
import Listen from "./Listen";
import { useSpeak } from "./useSpeak";
import { useDayIndex } from "./client";

/** మొదటి పేజీలో "ఈ రోజు సామెత": తేదీని బట్టి మారుతుంది. */
export default function TodaySametha({ list }: { list: string[] }) {
  const { speak, speaking } = useSpeak();
  const i = useDayIndex(list.length);
  const text = list[i];
  if (!text) return null;
  return (
    <div className="card today">
      <h2 className="vy-h3"><QuoteIcon size={20} aria-hidden="true" /> ఈ రోజు సామెత</h2>
      <blockquote className="sametha-big">{text}</blockquote>
      <div className="btn-row">
        <Listen text={text} speaking={speaking} speak={speak} />
        <Link className="btn" href="/sametalu/">అన్ని సామెతలు →</Link>
      </div>
    </div>
  );
}
