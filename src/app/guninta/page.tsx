import type { Metadata } from "next";
import { GUNINTA_MARKS, GUNINTA_VYANJANALU } from "@/data/bhashaMala";
import Guninta from "./Guninta";
import "@/styles/vy.css";

export const metadata: Metadata = { title: "గుణింతమాల", description: "34 హల్లులు, ప్రతి హల్లుకూ 16 గుణింత రూపాలు: చూడండి, వినండి, వెతకండి." };

export default function Page() {
  return (
    <section className="wrap" lang="te">
      <p className="kicker">వ్యాకరణం</p>
      <h1>గుణింతమాల</h1>
      <p className="lead">
        {GUNINTA_VYANJANALU.length} హల్లులు × {GUNINTA_MARKS.length} గుణింతాలు = {GUNINTA_VYANJANALU.length * GUNINTA_MARKS.length} అక్షరాలు. హల్లు ఎంచుకోండి: దాని గుణింతం అంతా కనిపిస్తుంది, ఒక్కొక్కటి నొక్కితే వినిపిస్తుంది.
      </p>
      <Guninta />
    </section>
  );
}
