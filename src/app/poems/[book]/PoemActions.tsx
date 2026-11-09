"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, ShareIcon, SpeakerIcon, StopIcon } from "@yuktishaalaa/yuktai/icons";

/** Copy, share and listen. Uses only the browser: nothing is sent to a server. */
export default function PoemActions({ title, text, author }: { title: string; text: string; author: string }) {
  const [note, setNote] = useState("");
  const [speaking, setSpeaking] = useState(false);
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
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(`${title}. ${text}`);
    u.lang = "te-IN";
    u.rate = 0.9;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(u);
  };

  return (
    <div className="poem-actions">
      <button type="button" className="btn" onClick={copy}><CopyIcon size={18} aria-hidden="true" /> కాపీ</button>
      <button type="button" className="btn" onClick={share}><ShareIcon size={18} aria-hidden="true" /> పంచుకోండి</button>
      <button type="button" className="btn" onClick={listen} aria-pressed={speaking}>
        {speaking ? <StopIcon size={18} aria-hidden="true" /> : <SpeakerIcon size={18} aria-hidden="true" />} {speaking ? "ఆపండి" : "వినండి"}
      </button>
      <span role="status" className="poem-note">{note && <><CheckIcon size={16} aria-hidden="true" /> {note}</>}</span>
    </div>
  );
}
