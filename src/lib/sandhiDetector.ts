// సంధి గుర్తింపు: పదం చూసి ఏ సంధో ఊహిస్తుంది. పాత రత్నాలబాల నియమాలే, అంతా బ్రౌజర్‌లోనే.
import { SANDHI_RULES } from "@/data/bhashaMala";

export interface DetectResult {
  detected: boolean;
  sandhiId: number;
  sandhiName: string;
  rule: string;
  purva: string;
  para: string;
  result: string;
  category: string;
  examples: { before: string; after: string }[];
}

export function detectSandhi(word: string): DetectResult {
  const NOT_FOUND: DetectResult = {
    detected: false, sandhiId: 0, sandhiName: "", rule: "",
    purva: "", para: "", result: "", category: "", examples: [],
  };

  const match = (id: number): DetectResult => {
    const r = SANDHI_RULES.find(x => x.id === id)!;
    return { detected: true, sandhiId: r.id, sandhiName: r.name, rule: r.rule,
      purva: r.purva, para: r.para, result: r.result, category: r.category, examples: r.examples };
  };

  // 4. యణాదేశ సంధి — త్య, ద్య, న్య, వ్య, మ్వ, న్వ
  if (/[కఖగఘచఛజఝటఠడఢణతథదధనపఫబభమయరలవశషసహళ]్య|[కఖగఘచఛజఝటఠడఢణతథదధనపఫబభమయరలవశషసహళ]్వ/.test(word))
    return match(4);

  // 26. ద్విరుక్తటకార సంధి
  if (/చిట్ట|కుట్ట|నట్ట|కట్టెద/.test(word)) return match(26);

  // 13. త్రిక సంధి
  if (/అత్తె|ఎచ్చ|ఆట్ట|ఈట్ట/.test(word)) return match(13);

  // 22. ద్విగు సమాస సంధి
  if (/ముల్ల|త్రిల్ల/.test(word)) return match(22);

  // 16. రుగాగమ సంధి
  if (/రాలు|రాలి|రాల$/.test(word)) return match(16);

  // 18. టుగాగమ సంధి
  if (/టాకు|టాకి|టాత/.test(word)) return match(18);

  // 11. యడాగమ సంధి — vowel + య + vowel pattern
  if (/[అఆఇఈఉఊఎఏఒఓ]య[అఆఇఈఉఊఎఏఒఓ]/.test(word)) return match(11);

  // 24. అల్లోప సంధి
  if (/నాది|వాది|తనది|వీడిది/.test(word) || (word.endsWith("ది") && word.length > 3)) return match(24);

  // 3. వృద్ధి సంధి — ై
  if (/ై/.test(word) && !/[కఖగఘచఛజఝటఠడఢణతథదధనపఫబభమయరలవశషసహళ]ై/.test(word)) return match(3);

  // 2. గుణసంధి — ే + ంద్ర or ో
  if (/ేంద్ర|ేశ్వర|ేంద్రు|ోత్సవ|ోపగత|ార్షి/.test(word)) return match(2);

  // 1. సవర్ణదీర్ఘ సంధి — ీంద్ర or ూత్సవ
  if (/ీంద్ర|ూత్సవ|ారులు|ీంద్రు/.test(word)) return match(1);

  // 8. అకార సంధి — double consonant హల్లు merge
  if (/[కఖగఘచఛజఝటఠడఢణతథదధనపఫబభమయరలవశషసహళ]త్త/.test(word)) return match(8);

  // 14. గసడదవాదేశ సంధి
  if (/డుద|డుగ|డుజ|డుబ/.test(word)) return match(14);

  // 19. నుగాగమ సంధి
  if (/యున|లున|వున/.test(word)) return match(19);

  return NOT_FOUND;
}
