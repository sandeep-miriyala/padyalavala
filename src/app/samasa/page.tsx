import type { Metadata } from "next";
import { SAMASA_RULES } from "@/data/bhashaMala";
import Samasa from "./Samasa";
import "@/styles/vy.css";

export const metadata: Metadata = { title: "సమాసమాల", description: "తెలుగు సమాసాలు: నిర్వచనాలు, రకాలు, విగ్రహ వాక్యాలు, సమాసం గుర్తింపు." };

export default function Page() {
  return (
    <section className="wrap" lang="te">
      <p className="kicker">వ్యాకరణం</p>
      <h1>సమాసమాల</h1>
      <p className="lead">
        {SAMASA_RULES.length} ముఖ్య సమాసాలు: నిర్వచనం, ప్రాధాన్యం, రకాలు, విగ్రహ వాక్యాలతో. ఒక సమాస పదం ఇస్తే దాని పేరు, విగ్రహ వాక్యం ఊహించి చెబుతుంది.
      </p>
      <Samasa />
    </section>
  );
}
