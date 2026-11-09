import type { Metadata } from "next";
import { THREE_FOUR_LETTER, TWO_LETTER } from "@/data/bhashaMala";
import Padalu from "./Padalu";
import "@/styles/vy.css";

export const metadata: Metadata = { title: "పదాలమాల", description: "రెండు, మూడు, నాలుగు అక్షరాల తెలుగు పదాలు: అక్షరం వారీగా చూడండి, వినండి." };

export default function Page() {
  return (
    <section className="wrap" lang="te">
      <p className="kicker">వ్యాకరణం</p>
      <h1>పదాలమాల</h1>
      <p className="lead">
        {TWO_LETTER.length + THREE_FOUR_LETTER.length} తెలుగు పదాలు. మొదటి అక్షరం ఎంచుకోండి; పదం మీద నొక్కితే అక్షరం అక్షరంగా విడగొట్టి చూపించి, చదివి వినిపిస్తుంది.
      </p>
      <Padalu />
    </section>
  );
}
