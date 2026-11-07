"use client";

import { useState } from "react";
import { CheckIcon } from "@yuktishaalaa/yuktai/icons";

/** Copy, share and listen. Uses only the browser: nothing is sent to a server. */
export default function PoemActions({ title, text, author }: { title: string; text: string; author: string }) {
  const [note, setNote] = useState("");
  const full = `${title}\n\n${text}\n\n— ${author}`;

  const say = (msg: string) => {
    setNote(msg);
    setTimeout(() => setNote(""), 2500);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(full);
      say("కాపీ అయింది");
    } catch {
      say("కాపీ కాలేదు");
    }
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: full, url });
      } catch {
        /* the visitor closed the share sheet */
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${full}\n${url}`)}`, "_blank", "noopener");
    }
  };

  const listen = () => {
    const synth = window.speechSynthesis;
    if (!synth) return say("ఈ బ్రౌజర్‌లో వినిపించడం లేదు");
    synth.cancel();
    const u = new SpeechSynthesisUtterance(`${title}. ${text}`);
    u.lang = "te-IN";
    u.rate = 0.9;
    synth.speak(u);
  };

  return (
    <div className="poem-actions">
      <button type="button" className="btn" onClick={copy}>కాపీ</button>
      <button type="button" className="btn" onClick={share}>పంచుకోండి</button>
      <button type="button" className="btn" onClick={listen}>వినండి</button>
      <span role="status" className="poem-note">{note && <><CheckIcon size={16} aria-hidden="true" /> {note}</>}</span>
    </div>
  );
}
