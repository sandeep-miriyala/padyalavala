"use client";

import { useState, type FormEvent } from "react";
import { ArrowRightIcon, ChatIcon } from "@yuktishaalaa/yuktai/icons";
import { ask } from "@/components/yuktai/ask";

/** "Ask this page" box: the answer comes from the page itself (Rust search, on this device). */
export default function HeroAsk() {
  const [q, setQ] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(q);
  };
  return (
    <form className="hero-ask" onSubmit={submit} role="search">
      <ChatIcon size={22} aria-hidden="true" />
      <label htmlFor="hero-q" className="sr-only">ఈ పేజీని అడగండి</label>
      <input id="hero-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ఏదైనా అడగండి… ఉదా: మిరా పద్యాలు ఎవరు రాశారు?" autoComplete="off" />
      <button className="btn primary" type="submit"><span>అడగండి</span><ArrowRightIcon size={18} aria-hidden="true" /></button>
    </form>
  );
}
