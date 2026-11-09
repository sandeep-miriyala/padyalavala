import type { Metadata } from "next";
import { getSametalu, sametaluLetters } from "@/data/sametalu";
import Sametalu from "./Sametalu";
import "@/styles/vy.css";

export const metadata: Metadata = { title: "సామెతలమాల", description: "తెలుగు సామెతలు అక్షరం వారీగా: వెతకండి, వినండి, పంచుకోండి." };

export default function Page() {
  const rows = getSametalu();
  const letters = sametaluLetters(rows);
  return (
    <section className="wrap" lang="te">
      <p className="kicker">వ్యాకరణం</p>
      <h1>సామెతలమాల</h1>
      <p className="lead">
        {rows.length} తెలుగు సామెతలు, {letters.length} అక్షరాలు. పెద్దలు చెప్పిన మాట: అక్షరం ఎంచుకోండి, లేదా ఒక్క పదంతో వెతకండి.
      </p>
      <Sametalu rows={rows} letters={letters} />
    </section>
  );
}
