import type { Metadata } from "next";
import { AKSHARALU } from "@/data/akshara";
import Aksharamala from "./Aksharamala";
import "@/styles/vy.css";

export const metadata: Metadata = { title: "అక్షరమాల", description: "తెలుగు అచ్చులు, హల్లులు: బొమ్మతో చూడండి, వినండి, రాసి చూడండి, పలికి చూడండి." };

export default function Page() {
  const achchulu = AKSHARALU.filter((a) => a.type === "achchu").length;
  return (
    <section className="wrap" lang="te">
      <p className="kicker">వ్యాకరణం</p>
      <h1>అక్షరమాల</h1>
      <p className="lead">
        {achchulu} అచ్చులు, {AKSHARALU.length - achchulu} హల్లులు. అక్షరం మీద నొక్కితే పెద్దగా కనిపిస్తుంది: విని, రాసి, పలికి నేర్చుకోండి.
      </p>
      <Aksharamala />
    </section>
  );
}
