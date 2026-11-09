// తెలుగు పదాన్ని అక్షరాలుగా విడగొట్టడం: హల్లు + ్ + హల్లు (క్ష, త్ర) ఒకే అక్షరం; గుణింతం గుర్తులు,
// అనుస్వారం, విసర్గ ముందు అక్షరంతోనే. ఉదా: "క్షమ" → ["క్ష", "మ"], "గంట" → ["గం", "ట"].
const VIRAMA = "్";
const isMark = (c: string) => /[ఀ-ఄ఼ా-ౖౢౣ‌‍]/.test(c);

export function aksharalu(word: string): string[] {
  const out: string[] = [];
  for (const c of word.normalize("NFC")) {
    const prev = out[out.length - 1];
    if (prev && (isMark(c) || prev.endsWith(VIRAMA))) out[out.length - 1] = prev + c;
    else if (c.trim()) out.push(c);
  }
  return out;
}
