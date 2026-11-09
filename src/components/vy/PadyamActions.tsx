"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, ShareIcon } from "@yuktishaalaa/yuktai/icons";
import Listen from "@/components/vy/Listen";

type Props = {
  id: string;
  title: string;
  text: string;
  author: string;
  speaking: string | null;
  speak: (t: string | string[], id?: string) => void;
};

/** పద్యం: వినండి, కాపీ, పంచుకోండి (WhatsApp). బ్రౌజర్‌లోనే: ఏదీ సర్వర్‌కు వెళ్ళదు. */
export default function PadyamActions({ id, title, text, author, speaking, speak }: Props) {
  const [note, setNote] = useState("");
  const full = `${title}\n\n${text}\n\n— ${author}`;
  const flash = (m: string) => {
    setNote(m);
    setTimeout(() => setNote(""), 2000);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(full);
      flash("కాపీ అయింది");
    } catch {
      flash("కాపీ కాలేదు");
    }
  };
  const share = async () => {
    const url = `${location.origin}${location.pathname}#${id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: full, url });
      } catch {
        /* closed */
      }
    } else window.open(`https://wa.me/?text=${encodeURIComponent(`${full}\n${url}`)}`, "_blank", "noopener");
  };
  return (
    <div className="btn-row">
      <Listen text={text.split("\n")} id={id} speaking={speaking} speak={speak} />
      <button type="button" className="btn" onClick={copy}><CopyIcon size={18} aria-hidden="true" /> కాపీ</button>
      <button type="button" className="btn" onClick={share}><ShareIcon size={18} aria-hidden="true" /> పంచుకోండి</button>
      <span className="hint" role="status">{note && <><CheckIcon size={14} aria-hidden="true" /> {note}</>}</span>
    </div>
  );
}
