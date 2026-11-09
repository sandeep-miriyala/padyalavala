import type { Metadata } from "next";
import { SANDHI_RULES } from "@/data/bhashaMala";
import Sandhi from "./Sandhi";
import "@/styles/vy.css";

export const metadata: Metadata = { title: "సంధిమాల", description: "తెలుగు వ్యాకరణంలో 26 సంధులు: నియమాలు, ఉదాహరణలు, పదం ఇస్తే సంధి గుర్తింపు." };

export default function Page() {
  return (
    <section className="wrap" lang="te">
      <p className="kicker">వ్యాకరణం</p>
      <h1>సంధిమాల</h1>
      <p className="lead">
        తెలుగు వ్యాకరణంలో {SANDHI_RULES.length} సంధులు: నిర్వచనం, పూర్వ పదం, పర పదం, ఫలితం, ఉదాహరణలతో. ఒక పదం ఇస్తే అది ఏ సంధో ఊహించి చెబుతుంది.
      </p>
      <Sandhi />
    </section>
  );
}
