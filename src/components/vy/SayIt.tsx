"use client";

import { useEffect, useRef, useState } from "react";
import { MicIcon, StopIcon } from "@yuktishaalaa/yuktai/icons";
import { useBrowser } from "./client";

type Rec = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

const clean = (s: string) => s.normalize("NFC").replace(/[\s.,!?।'"“”‘’-]/g, "");

/** 0..1: how close two words are (edit distance). */
function similar(a: string, b: string) {
  const x = [...clean(a)], y = [...clean(b)];
  if (!x.length || !y.length) return 0;
  const d = Array.from({ length: x.length + 1 }, (_, i) => [i, ...Array(y.length).fill(0)]);
  for (let j = 1; j <= y.length; j++) d[0][j] = j;
  for (let i = 1; i <= x.length; i++)
    for (let j = 1; j <= y.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
  return 1 - d[x.length][y.length] / Math.max(x.length, y.length);
}

/**
 * "పలికి చూడండి": పదం పలికితే బ్రౌజర్ మాట గుర్తింపు (te-IN) విని, సరిగ్గా పలికారో చెబుతుంది.
 * గమనిక: Chrome లో మాట గుర్తింపు Google సేవ ద్వారా జరుగుతుంది. ఈ సైట్ ఏదీ దాచుకోదు.
 */
export default function SayIt({ word }: { word: string }) {
  const rec = useRef<Rec | null>(null);
  const supported = useBrowser(() => "SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  const [listening, setListening] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // the parent gives a new key for each word, so the message starts empty
  useEffect(() => () => rec.current?.stop(), []);

  const start = () => {
    const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = "te-IN";
    r.interimResults = false;
    r.maxAlternatives = 3;
    r.onresult = (e) => {
      const alts = Array.from(e.results[0] ?? []).map((a) => a.transcript);
      const best = alts.map((t) => ({ t, s: similar(t, word) })).sort((a, b) => b.s - a.s)[0];
      if (!best) return setMsg({ ok: false, text: "వినబడలేదు. మళ్ళీ పలకండి." });
      if (best.s >= 0.8) setMsg({ ok: true, text: `చాలా బాగా పలికారు! “${best.t}” 🎉` });
      else if (best.s >= 0.5) setMsg({ ok: false, text: `దగ్గరగా ఉంది: “${best.t}”. “${word}” అని మళ్ళీ పలకండి.` });
      else setMsg({ ok: false, text: `“${best.t}” అని వినిపించింది. “${word}” అని పలకండి.` });
    };
    r.onerror = (e) =>
      setMsg({ ok: false, text: e.error === "not-allowed" ? "మైక్ అనుమతి ఇవ్వలేదు. బ్రౌజర్ సెట్టింగ్‌లో అనుమతించండి." : "వినడంలో సమస్య వచ్చింది. మళ్ళీ ప్రయత్నించండి." });
    r.onend = () => setListening(false);
    rec.current = r;
    setMsg(null);
    setListening(true);
    r.start();
  };

  if (!supported) return <p className="hint">ఈ బ్రౌజర్‌లో మాట గుర్తింపు లేదు. Chrome లేదా Edge లో ప్రయత్నించండి.</p>;

  return (
    <div className="sayit">
      <button type="button" className={`btn${listening ? "" : " primary"}`} onClick={listening ? () => rec.current?.stop() : start} aria-pressed={listening}>
        {listening ? <StopIcon size={18} aria-hidden="true" /> : <MicIcon size={18} aria-hidden="true" />}
        {listening ? "వింటున్నాను… ఆపండి" : `“${word}” అని పలకండి`}
      </button>
      <p className={`trace-result${msg ? (msg.ok ? " good" : " try") : ""}`} role="status">{msg?.text ?? ""}</p>
      <p className="hint">Chrome లో మాట గుర్తింపు Google సేవ ద్వారా జరుగుతుంది. ఈ సైట్ మీ మాటను దాచుకోదు.</p>
    </div>
  );
}
