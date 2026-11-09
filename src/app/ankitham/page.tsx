import type { Metadata } from "next";
import { HeartIcon } from "@yuktishaalaa/yuktai/icons";
import "@/styles/vy.css";

export const metadata: Metadata = { title: "అంకితం", description: "రత్నాలబాల: శ్రీ మిరియాల వెంకట రత్నం గారికి అంకితం." };

// పాత రత్నాలబాల అంకితం పేజీ పాఠం, మార్పు లేకుండా (ఖాళీలు మాత్రమే సరిచేశాం).
export default function Page() {
  return (
    <section className="wrap" lang="te">
      <p className="kicker">రత్నాలబాల</p>
      <h1>అంకితం</h1>
      <article className="card ankitham">
        <span className="iconbox"><HeartIcon size={22} aria-hidden="true" /></span>
        <p>
          మా ప్రియతమ తాతయ్య, రచయిత <strong>శ్రీ మిరియాల వెంకట రత్నం</strong> గారికి, మరియు ఈ పుస్తక రూపకల్పనలో భాగమైన
          శ్రీ కామ బుషి సత్య నారాయణ వర్మ (ఆముఖం), డాక్టర్ మిరియాల రామ కృష్ణ (సంపాదకుడు), శ్రీమతి ఎం లక్ష్మి దేవి (ప్రచురణ)
          గార్లకు అంకితం చేస్తున్నాము. వారి సహకారం, కృషి లేకుండా ఇది సాధ్యమయ్యేది కాదు.
        </p>
        <p>కృతజ్ఞతలతో,<br />మీ కుటుంబం</p>
        <details className="bhavam" lang="en">
          <summary>English</summary>
          <p>
            We dedicate this book to our beloved grandfather, the author Sri Miriyala Venkata Ratnam, and to Sri Kama Bushi
            Satyanarayana Varma (Editor), Dr. Miriyala Rama Krishna (Editor) and Smt. M. Lakshmi Devi (Publisher), who were part of
            the creation of this book. This would not have been possible without their support and hard work.
          </p>
          <p>With gratitude,<br />Your family</p>
        </details>
      </article>
    </section>
  );
}
