import type { Metadata } from "next";
import { ageGroups, getKathalu } from "@/data/kathamala";
import Kathamala from "./Kathamala";
import "@/styles/vy.css";

export const metadata: Metadata = { title: "కథామాల", description: "పిల్లల కోసం చిన్న తెలుగు కథలు, వయసు వారీగా: చదవండి, వినండి, నీతి నేర్చుకోండి." };

export default function Page() {
  const rows = getKathalu();
  const ages = ageGroups(rows);
  return (
    <section className="wrap" lang="te">
      <p className="kicker">సాహిత్యం</p>
      <h1>కథామాల</h1>
      <p className="lead">పిల్లల కోసం {rows.length} చిన్న కథలు, {ages.length} వయసు గుంపులు. ప్రతి కథ చివర ఒక నీతి. 🔊 నొక్కితే కథ చదివి వినిపిస్తుంది.</p>
      <Kathamala rows={rows} ages={ages} />
    </section>
  );
}
