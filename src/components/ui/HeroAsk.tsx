"use client";

import { useState, type FormEvent } from "react";
import { ArrowRightIcon, ChatIcon } from "@yuktishaalaa/yuktai/icons";
import { ask } from "@/components/yuktai/ask";

/** "ఈ పేజీని అడగండి": జవాబు ఈ పేజీ నుంచే (Rust వెతుకులాట, మీ పరికరంలోనే). */
export default function HeroAsk() {
  const [q, setQ] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(q);
    setQ("");
  };
  return (
    <form className="hero-ask" onSubmit={submit} role="search">
      <ChatIcon size={22} aria-hidden="true" />
      <label htmlFor="hero-q" className="sr-only">ఈ పేజీని అడగండి</label>
      <input id="hero-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ఏదైనా అడగండి… ఉదా: గుణింతం అంటే ఏమిటి?" autoComplete="off" enterKeyHint="send" />
      <button className="btn primary" type="submit"><span>అడగండి</span><ArrowRightIcon size={18} aria-hidden="true" /></button>
    </form>
  );
}
