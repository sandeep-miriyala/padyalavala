// The app's core: Rust compiled to WebAssembly (rust/src/lib.rs → public/wasm/core.wasm).
// If the .wasm is not there (Rust not installed, or the build skipped it), the same
// functions run in TypeScript, so the app always works.
export type Engine = "rust" | "ts";
/** Letter tracing: (coverage %, precision %) or null when the letter can't be scored. */
export type TraceScore = { coverage: number; precision: number } | null;
type Core = {
  engine: Engine;
  countWords: (text: string) => number;
  scoreTrace: (drawn: Uint8Array, target: Uint8Array, side: number) => TraceScore;
};

// Same separators as rust/src/lib.rs: spaces, ASCII punctuation, “ ” ‘ ’ — – … । ॥
const SEP = /[\s!-/:-@[-`{-~“”‘’—–…।॥]+/u;
export function countWordsTs(text: string): number {
  return text.split(SEP).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

// Same rules as trace_score in rust/src/lib.rs: a stroke counts within TOLERANCE cells of the letter.
const TOLERANCE = 2;
const INK = 32;
function dilate(mask: boolean[], side: number): boolean[] {
  const out = new Array<boolean>(mask.length).fill(false);
  for (let y = 0; y < side; y++)
    for (let x = 0; x < side; x++) {
      if (!mask[y * side + x]) continue;
      for (let dy = -TOLERANCE; dy <= TOLERANCE; dy++)
        for (let dx = -TOLERANCE; dx <= TOLERANCE; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < side && ny < side) out[ny * side + nx] = true;
        }
    }
  return out;
}
export function scoreTraceTs(drawn: Uint8Array, target: Uint8Array, side: number): TraceScore {
  if (!side || drawn.length !== side * side || target.length !== side * side) return null;
  const d = Array.from(drawn, (v) => v >= INK);
  const t = Array.from(target, (v) => v >= INK);
  const targetTotal = t.filter(Boolean).length;
  if (!targetTotal) return null;
  const drawnTotal = d.filter(Boolean).length;
  if (!drawnTotal) return { coverage: 0, precision: 0 };
  const dn = dilate(d, side), tn = dilate(t, side);
  const covered = t.filter((v, i) => v && dn[i]).length;
  const precise = d.filter((v, i) => v && tn[i]).length;
  return { coverage: Math.floor((covered * 100) / targetTotal), precision: Math.floor((precise * 100) / drawnTotal) };
}

type Exports = {
  memory: WebAssembly.Memory;
  alloc: (len: number) => number;
  dealloc: (ptr: number, len: number) => void;
  count_words_utf8: (ptr: number, len: number) => number;
  score_trace?: (drawn: number, target: number, side: number) => number;
};

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
let loading: Promise<Core> | null = null;

async function loadRust(): Promise<Core> {
  const res = await fetch(`${base}/wasm/core.wasm`);
  if (!res.ok) throw new Error("no wasm");
  const { instance } = await WebAssembly.instantiate(await res.arrayBuffer(), {});
  const w = instance.exports as unknown as Exports;
  const enc = new TextEncoder();
  return {
    engine: "rust",
    countWords(text) {
      const bytes = enc.encode(text);
      if (!bytes.length) return 0;
      const ptr = w.alloc(bytes.length);
      try {
        new Uint8Array(w.memory.buffer, ptr, bytes.length).set(bytes);
        return w.count_words_utf8(ptr, bytes.length);
      } finally {
        w.dealloc(ptr, bytes.length);
      }
    },
    scoreTrace(drawn, target, side) {
      if (!w.score_trace || drawn.length !== side * side || target.length !== side * side) return scoreTraceTs(drawn, target, side);
      const n = side * side;
      const a = w.alloc(n);
      const b = w.alloc(n);
      try {
        new Uint8Array(w.memory.buffer, a, n).set(drawn);
        new Uint8Array(w.memory.buffer, b, n).set(target);
        const r = w.score_trace(a, b, side) >>> 0;
        return r === 0xffffffff ? null : { coverage: r >> 8, precision: r & 0xff };
      } finally {
        w.dealloc(a, n);
        w.dealloc(b, n);
      }
    },
  };
}

export function loadCore(): Promise<Core> {
  loading ??= loadRust().catch(() => ({ engine: "ts" as const, countWords: countWordsTs, scoreTrace: scoreTraceTs }));
  return loading;
}
