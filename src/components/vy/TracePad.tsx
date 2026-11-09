"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckIcon, DeleteIcon, PenIcon, SpeedIcon } from "@yuktishaalaa/yuktai/icons";
import { loadCore, type Engine } from "@/lib/core";

const VIEW = 280; // canvas size on screen (CSS px)
const GRID = 64; // both shapes are compared on a 64 × 64 grid, as in the old Python/Rust check
const FILL = 0.8; // the letter fills at most 80% of the box
const PASS = 60;
const GREAT = 80;
const FONT = '"Noto Sans Telugu", "Nirmala UI", "Telugu Sangam MN", "Gautami", sans-serif';

/** Draws the letter centred by its real glyph bounds, as big as fits. Same layout at any size. */
function drawLetter(ctx: CanvasRenderingContext2D, letter: string, size: number, color: string) {
  let px = size * 0.7;
  ctx.font = `700 ${px}px ${FONT}`;
  let m = ctx.measureText(letter);
  const w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  const shrink = Math.min(1, (size * FILL) / Math.max(w, 1), (size * FILL) / Math.max(h, 1));
  if (shrink < 1) {
    px *= shrink;
    ctx.font = `700 ${px}px ${FONT}`;
    m = ctx.measureText(letter);
  }
  const bw = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const bh = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  ctx.fillStyle = color;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(letter, (size - bw) / 2 + m.actualBoundingBoxLeft, (size - bh) / 2 + m.actualBoundingBoxAscent);
}

function alphaMask(canvas: HTMLCanvasElement): Uint8Array {
  const small = document.createElement("canvas");
  small.width = small.height = GRID;
  const ctx = small.getContext("2d")!;
  ctx.drawImage(canvas, 0, 0, GRID, GRID);
  const data = ctx.getImageData(0, 0, GRID, GRID).data;
  const out = new Uint8Array(GRID * GRID);
  for (let i = 0; i < out.length; i++) out[i] = data[i * 4 + 3];
  return out;
}

function targetMask(letter: string): Uint8Array {
  const c = document.createElement("canvas");
  c.width = c.height = GRID;
  drawLetter(c.getContext("2d")!, letter, GRID, "#000");
  return alphaMask(c);
}

function verdict(coverage: number, precision: number) {
  if (coverage >= GREAT && precision >= GREAT) return { ok: true, text: "అద్భుతం! చాలా బాగా రాశారు 🎉" };
  if (coverage >= PASS && precision >= PASS) return { ok: true, text: "బాగుంది! 👍" };
  if (coverage < PASS && precision >= PASS) return { ok: false, text: "కొంత భాగం మిగిలిపోయింది: అక్షరం పూర్తిగా రాయండి." };
  if (precision < PASS && coverage >= PASS) return { ok: false, text: "గీతలు అక్షరం బయటకు వెళ్ళాయి: జాగ్రత్తగా రాయండి." };
  return { ok: false, text: "మళ్ళీ ప్రయత్నించండి: బూడిద రంగు అక్షరం మీదే రాయండి." };
}

/**
 * "రాసి చూడండి": బూడిద రంగు అక్షరం మీద వేలితో / మౌస్‌తో / పెన్‌తో రాయాలి. సరిచూడడం Rust
 * (WebAssembly) లో, అది లేకపోతే అదే నియమాలతో TypeScript లో. బొమ్మ ఎక్కడికీ వెళ్ళదు.
 */
export default function TracePad({ letter }: { letter: string }) {
  const guide = useRef<HTMLCanvasElement>(null);
  const pad = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [result, setResult] = useState<{ ok: boolean; text: string; score?: number } | null>(null);
  const [engine, setEngine] = useState<Engine | null>(null);

  const paint = useCallback(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    for (const c of [guide.current, pad.current]) {
      if (!c) continue;
      c.width = c.height = Math.round(VIEW * dpr);
      const ctx = c.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, VIEW, VIEW);
    }
    const g = guide.current?.getContext("2d");
    if (g) {
      const muted = getComputedStyle(document.documentElement).getPropertyValue("--line-soft").trim() || "#d9d6ea";
      drawLetter(g, letter, VIEW, muted);
    }
  }, [letter]);

  useEffect(() => {
    paint();
    // fonts may arrive after the first draw
    document.fonts?.ready.then(paint).catch(() => {});
  }, [paint]);

  const clear = () => {
    paint();
    setResult(null);
  };

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * VIEW, y: ((e.clientY - r.top) / r.height) * VIEW };
  };

  const stroke = (to: { x: number; y: number }) => {
    const ctx = pad.current?.getContext("2d");
    if (!ctx) return;
    const from = last.current ?? to;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#8a3a00";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x + 0.01, to.y + 0.01);
    ctx.stroke();
    last.current = to;
  };

  const check = async () => {
    if (!pad.current) return;
    const core = await loadCore();
    setEngine(core.engine);
    const drawn = alphaMask(pad.current);
    if (!drawn.some((v) => v >= 32)) return setResult({ ok: false, text: "ముందు బూడిద రంగు అక్షరం మీద రాయండి." });
    const score = core.scoreTrace(drawn, targetMask(letter), GRID);
    if (!score) return setResult({ ok: false, text: "ఈ అక్షరాన్ని సరిచూడలేకపోయాను." });
    setResult({ ...verdict(score.coverage, score.precision), score: Math.round((score.coverage + score.precision) / 2) });
  };

  return (
    <div className="trace">
      <div className="trace-box">
        <canvas ref={guide} className="trace-guide" aria-hidden="true" />
        <canvas
          ref={pad}
          className="trace-pad"
          role="img"
          aria-label={`${letter} అక్షరాన్ని ఇక్కడ రాయండి`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            drawing.current = true;
            last.current = null;
            stroke(point(e));
          }}
          onPointerMove={(e) => drawing.current && stroke(point(e))}
          onPointerUp={() => {
            drawing.current = false;
            last.current = null;
          }}
          onPointerCancel={() => {
            drawing.current = false;
            last.current = null;
          }}
        />
      </div>
      <div className="btn-row">
        <button type="button" className="btn primary" onClick={check}><CheckIcon size={18} aria-hidden="true" /> సరిచూడండి</button>
        <button type="button" className="btn" onClick={clear}><DeleteIcon size={18} aria-hidden="true" /> చెరిపేయండి</button>
      </div>
      <p className={`trace-result${result ? (result.ok ? " good" : " try") : ""}`} role="status">
        {result ? (
          <>
            {result.ok ? <CheckIcon size={18} aria-hidden="true" /> : <PenIcon size={18} aria-hidden="true" />} {result.text}
            {result.score !== undefined && <> ({result.score}%)</>}
          </>
        ) : (
          "బూడిద రంగు అక్షరం మీద రాసి, సరిచూడండి నొక్కండి."
        )}
      </p>
      {engine && (
        <p className="hint"><SpeedIcon size={14} aria-hidden="true" /> సరిచూసింది: {engine === "rust" ? "Rust (WebAssembly)" : "TypeScript"}, మీ పరికరంలోనే.</p>
      )}
    </div>
  );
}
